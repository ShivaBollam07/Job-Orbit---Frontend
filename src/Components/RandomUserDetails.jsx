import { useEffect, useState } from 'react';
import '../Styles/RandomUserDetails.css';

const RandomUserDetails
    = () => {
        const [profileData, setProfileData] = useState(null);

        useEffect(() => {
            const fetchProfileData = async () => {
                try {
                    const user_id = 1;
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3000/app/v1/userauth/profile/getDetails', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ user_id })
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }
                    const data = await response.json();
                    console.log(data);
                    setProfileData(data);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            };

            fetchProfileData();
        }, []);

        if (!profileData) {
            return <div className="loading">Loading...</div>;
        }

        const { user, educationDetails, skills, experienceDetails } = profileData;

        // Remove duplicate skills using a Set
        const uniqueSkills = [...new Set(skills.map(skill => skill.skill_name))];

        // Get initials from first and last name
        const getInitials = (firstName, lastName) => {
            return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
        };

        return (
            <div className="profile-details">
                <h1>User Profile</h1>

                <div className="profile-info">
                    <div className="profile-image">
                        {getInitials(user.first_name, user.last_name)}
                    </div>
                    <div className='profile-name-email'>
                        <div className="profile-name">{`${user.first_name} ${user.last_name}`}</div>
                        <div className="profile-email">{user.email}</div>
                    </div>
                </div>

                {/* Education Details */}
                <div className="section">
                    <h2>Education</h2>
                    <div className="profile-details-list">
                        {educationDetails.map((education) => (
                            <div key={education.education_id} className="card">
                                <div className="card-header">
                                    <div className="institution">
                                        <h4>Institution:</h4>
                                        {education.institution_name}</div>
                                    <div className="degree">
                                        <h4>
                                            Degree:
                                        </h4>
                                        {education.degree}</div>
                                </div>
                                <div className="card-content">
                                    <div>
                                        <h4>
                                            Branch:
                                        </h4>
                                        {education.institution_branch}</div>
                                    <div>
                                        <h4>
                                            Duration:
                                        </h4>
                                        {education.start_date.slice(0, 4)} - {education.end_date.slice(0, 4)}</div>
                                    <div>
                                        <h4>

                                            Grade:
                                        </h4>
                                        {education.grade}</div>
                                    <div>
                                        <h4>
                                            Description:
                                        </h4>
                                        {education.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience Details */}
                <div className="section">
                    <h2>Experience</h2>
                    <div className="profile-details-list">
                        {experienceDetails.map((experience) => (
                            <div key={experience.experience_id} className="card">
                                <div className="card-header">
                                    <div className="company">
                                        <h4>
                                            Company:
                                        </h4>
                                        {experience.company_name}</div>
                                    <div className="job-role">
                                        <h4>
                                            Job Role:
                                        </h4>

                                        {experience.job_role}</div>
                                </div>
                                <div className="card-content">
                                    <div>
                                        <h4>
                                            Branch:
                                        </h4>
                                        {experience.company_branch}</div>
                                    <div>
                                        <h4>
                                            Duration:
                                        </h4>
                                        {experience.start_date.slice(0, 4)} - {experience.end_date.slice(0, 4)}</div>
                                    <div>
                                        <h4>
                                            Description:
                                        </h4>
                                        {experience.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Unique Skills */}
                <div className="section">
                    <h2>Skills</h2>
                    <div className="profile-details-list">
                        {uniqueSkills.map((skill, index) => (
                            <div key={index} className="skill-card">
                                <div className="skill">{skill}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

export default RandomUserDetails
    ;
