import { Request, Response } from 'express';
import JobApplication from '../../models/JobApplication';

// Get all job applications
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await JobApplication.find()
      .populate('jobId', 'title hospitalName location department')
      .sort({ appliedDate: -1 });
    
    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to fetch applications", 
      error: error.message 
    });
  }
};

// Mark application as viewed
export const markAsViewed = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { recruiterId } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      {
        viewedByRecruiter: true,
        viewedAt: new Date(),
        recruiterId: recruiterId,
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application marked as viewed",
      application
    });
  } catch (error: any) {
    console.error('Error marking as viewed:', error);
    res.status(500).json({ 
      message: "Failed to mark application as viewed", 
      error: error.message 
    });
  }
};

// Update application status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, recruiterFeedback } = req.body;

    console.log('Updating application:', id, 'with status:', status);

    const application = await JobApplication.findByIdAndUpdate(
      id,
      {
        status,
        recruiterFeedback: recruiterFeedback || '',
        lastUpdate: new Date(),
      },
      { new: true }
    ).populate('jobId', 'title hospitalName location');

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated successfully",
      application
    });
  } catch (error: any) {
    console.error('Error updating status:', error);
    res.status(500).json({ 
      message: "Failed to update application status", 
      error: error.message 
    });
  }
};