import { Request, Response } from 'express';
import getFeedbackModel from '../models/Feedback';
import getDegreeModel from '../models/Degree';

// POST /feedback/submit
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    // Get user ID from JWT token instead of header
    const userId = (req as any).user?.id || (req as any).user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { rating, heading, feedback, source, degreeId, institutionId, sourceDetails } = req.body;

    // Validate required fields
    if (!rating || !heading || !feedback || !source) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get user details from JWT token or request body
    const userType = (req as any).user?.userType || req.body.userType;
    const userName = (req as any).user?.name || req.body.userName;
    const userEmail = (req as any).user?.email || req.body.userEmail;

    // Create feedback object with all required fields
    const feedbackData = {
      userId,
      userType: userType || 'Unknown',
      userName: userName || 'Anonymous',
      userEmail: userEmail || '',
      rating,
      heading,
      feedback,
      source,
      sourceDetails: sourceDetails || null,
      degreeId: degreeId || null,
      institutionId: institutionId || null,
      status: 'pending', // Default status
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newFeedback = new (getFeedbackModel())(feedbackData);
    await newFeedback.save();

    res.status(201).json({ 
      message: "Feedback submitted successfully",
      feedback: newFeedback 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

// GET /feedback/list (for institutions to see their feedback)
export const getFeedbackList = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const institutionId = (req as any).user?.id || (req as any).user?._id;
    const { source, status, page = 1, limit = 10 } = req.query;

    console.log('=== DEBUG: Get Feedback List ===');
    console.log('Institution ID from JWT:', institutionId);
    console.log('Filters:', { source, status, page, limit });

    // Build filter conditions
    const filter: any = {};
    
    // Filter by institution if provided
    if (institutionId) {
      // For degree application feedback, only show feedback for this institution's degrees
      if (source === 'degree_application') {
        filter.institutionId = institutionId;
        filter.source = 'degree_application';
      } else {
        // For other sources, include general feedback as well
        filter.$or = [
          { institutionId: institutionId },
          { source: 'general' }
        ];
      }
    } else {
      // If no institutionId, apply source filter normally
      if (source && source !== 'all') {
        filter.source = source;
      }
    }

    // Filter by status if specified (only if not already filtered by institution)
    if (status && status !== 'all' && !institutionId) {
      filter.status = status;
    }

    console.log('Filter conditions:', filter);

    // Calculate pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get feedback with pagination
    const feedbacks = await getFeedbackModel()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalCount = await getFeedbackModel().countDocuments(filter);

    console.log('Feedbacks found:', feedbacks.length);
    console.log('Total count:', totalCount);
    
    // Debug: Show what feedbacks were found
    if (feedbacks.length > 0) {
      console.log('Sample feedbacks found:');
      feedbacks.slice(0, 3).forEach((fb, index) => {
        console.log(`Feedback ${index + 1}:`, {
          id: fb._id,
          source: fb.source,
          institutionId: fb.institutionId,
          heading: fb.heading,
          userName: fb.userName
        });
      });
    } else {
      console.log('No feedbacks found with current filter');
      // Debug: Check what feedbacks exist in database
      const allFeedbacks = await getFeedbackModel().find({}).select('source institutionId heading userName').lean();
      console.log('All feedbacks in database:', allFeedbacks.length);
      allFeedbacks.slice(0, 5).forEach((fb, index) => {
        console.log(`All feedback ${index + 1}:`, {
          source: fb.source,
          institutionId: fb.institutionId,
          heading: fb.heading
        });
      });
    }

    res.json({
      success: true,
      feedbacks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNextPage: pageNum * limitNum < totalCount,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error getting feedback list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedback list',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /feedback/admin (for admin to see all feedback)
export const getAdminFeedbackList = async (req: Request, res: Response) => {
  try {
    const { source, status, userType, page = 1, limit = 20 } = req.query;

    console.log('=== DEBUG: Admin Get Feedback List ===');
    console.log('Filters:', { source, status, userType, page, limit });

    // Build filter conditions
    const filter: any = {};

    // Filter by source if specified
    if (source && source !== 'all') {
      filter.source = source;
    }

    // Filter by status if specified
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Filter by user type if specified
    if (userType && userType !== 'all') {
      filter.userType = userType;
    }

    console.log('Filter conditions:', filter);

    // Calculate pagination
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Get feedback with pagination
    const feedbacks = await getFeedbackModel()
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalCount = await getFeedbackModel().countDocuments(filter);

    // Get statistics
    const stats = await getFeedbackModel().aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          reviewedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] }
          },
          resolvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      }
    ]);

    console.log('Feedbacks found:', feedbacks.length);
    console.log('Total count:', totalCount);
    console.log('Statistics:', stats[0]);

    res.json({
      success: true,
      feedbacks,
      statistics: stats[0] || {
        totalFeedbacks: 0,
        avgRating: 0,
        pendingCount: 0,
        reviewedCount: 0,
        resolvedCount: 0
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNextPage: pageNum * limitNum < totalCount,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error getting admin feedback list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedback list',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /feedback/institution (for institutions to see their degree application feedback)
export const getInstitutionFeedback = async (req: Request, res: Response) => {
  try {
    // Get institution ID from JWT token instead of header
    const institutionId = (req as any).user?._id;
    if (!institutionId) {
      return res.status(401).json({ message: "Institution not authenticated" });
    }

    const { source, status } = req.query;
    const query: any = { source: 'degree_application' };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get degrees for this institution
    const degrees = await getDegreeModel().find({ institutionId }).select('_id degreeName');
    const degreeIds = degrees.map(d => (d._id as any).toString());

    // Get feedback for degrees from this institution
    const feedback = await getFeedbackModel().find({
      ...query,
      degreeId: { $in: degreeIds }
    }).sort({ createdAt: -1 });

    res.json(feedback);
  } catch (error) {
    console.error('Error fetching institution feedback:', error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// PATCH /feedback/:id/status (for admin to update feedback status)
export const updateFeedbackStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    console.log('=== DEBUG: Update Feedback Status ===');
    console.log('Feedback ID:', id);
    console.log('New status:', status);
    console.log('Admin response:', adminResponse);

    // Validate status
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, reviewed, or resolved'
      });
    }

    // Update feedback
    const updatedFeedback = await getFeedbackModel().findByIdAndUpdate(
      id,
      { 
        status, 
        adminResponse,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    console.log('Feedback updated successfully');

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      feedback: updatedFeedback
    });

  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 