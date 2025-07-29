import React from "react";
import ProfileForm from "../../components/Settings/ProfileForm";



function profile() {
  return (
    <>
      <div className="p-6 bg-white min-h-full">
        <h3 className="text-3xl font-bold text-gray-800 mb-8">Profile</h3>


        <ProfileForm />
        
      </div>
    </>
  );
}

export default profile;
