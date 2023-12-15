users: {
    firstName: "";
    lastName: "";
    accountType:"";
    country: "";
    city: "";
    jobTitle: "";
    jobType: "";
    company: "";
    schoolName: "";
    startYear: "";
    endYear: "";
    initialOnboarding: true; //it's set to true because based on this we'll not be able to access the onboarding/start route by url.
    // TODO: this will tell to checkAuthState that the user just signed up and we have to navigate it to onboarding/name. But when the onboarding complete, you must set this to false or completely remove the property from the firebase object.
    sentRequests: [user1,user2];
    receivedRequests: [user1,user2];
    posts: [postID1,postID2];
    searchTerms: ["john", "doe", "regular", "usa", "new york", "software engineer", "full-time", "techco", "university of xyz"]

}

posts: {
    id: "";
    desc: "";
    mediaType: ""; //PHOTO, VIDEO, DOCUMENT, POLL, NONE
    likes: "";
    comments: "";
    shares: "";
    reposts: "";
}

followers: {
    
}

following: {
    
}

likes: {

}

experience: {
    title: "";
    employmentType: ""; //full-time, part-time, freelance, 
    companyName: ""; //Microsoft
    Locaiton: "";
    startDate: "";
    endData: ""; // present
    description: "";
}

education: {
    school: ""; //Boston Uni
    degree: "";
    startDate: "";
    endDate: "";
    description: "";
}

