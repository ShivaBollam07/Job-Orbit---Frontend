CREATE TABLE contactinformation (
    contact_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    website VARCHAR(255)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    contact_id INT UNIQUE NOT NULL,
    about TEXT,
    hashedpassword VARCHAR(255) NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES contactinformation(contact_id)
)

CREATE TABLE Institution (
    institution_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(255)
);

CREATE TABLE educationdetails (
    education_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    institution_id INT NOT NULL,
    degree VARCHAR(255) NOT NULL,
    school VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    grade VARCHAR(10),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (institution_id) REFERENCES Institution(institution_id)
);

CREATE TABLE user_institutions (   -----------------------Junction table between users and Institution
    user_id INT NOT NULL,
    institution_id INT NOT NULL,
    PRIMARY KEY (user_id, institution_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (institution_id) REFERENCES Institution(institution_id)
);

CREATE TABLE Skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(255) NOT NULL
);

CREATE TABLE EducationSkills (    -----------------------> Junction table between EducationDetails and Skills
    education_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (education_id, skill_id),
    FOREIGN KEY (education_id) REFERENCES EducationDetails(education_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE Company (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(255),
    about_company TEXT
);

CREATE TABLE experiencedetails (
    experience_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    company_id INT NOT NULL,
    job_role VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    job_type VARCHAR(100),
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES Company(company_id)
);

CREATE TABLE ExperienceSkills (  -----------------------> Junction table between ExperienceDetails and Skills
    experience_id INT NOT NULL,
    skill_id INT NOT NULL,
    PRIMARY KEY (experience_id, skill_id),
    FOREIGN KEY (experience_id) REFERENCES ExperienceDetails(experience_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE Posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE Likes (
    like_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id), -- Ensures each user can like a post only once
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE jobs (
    job_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    company_description TEXT,
    company_email VARCHAR(255) NOT NULL,
    role_needed VARCHAR(255) NOT NULL,
    role_responsibilities TEXT,
    skills_required TEXT,
    job_description TEXT,
    recruiter_name VARCHAR(255) NOT NULL
);

-- Universal Table

SELECT
    u.user_id,
    u.first_name,
    u.middle_name,
    u.last_name,
    ci.email AS contact_email,
    ci.website AS contact_website,
    e.education_id,
    e.degree,
    e.school,
    e.start_date AS education_start_date,
    e.end_date AS education_end_date,
    i.institution_id,
    i.name AS institution_name,
    i.branch AS institution_branch,
    s.skill_id,
    s.skill_name,
    c.company_id,
    c.name AS company_name,
    c.branch AS company_branch,
    ed.experience_id,
    ed.job_role AS experience_job_role,
    ed.start_date AS experience_start_date,
    ed.end_date AS experience_end_date,
    ed.job_type AS experience_job_type,
    p.post_id,
    p.description AS post_description,
    p.created_at AS post_created_at,
    co.comment_id,
    co.description AS comment_description,
    co.created_at AS comment_created_at,
    l.like_id,
    l.created_at AS like_created_at
FROM
    users u
JOIN
    contactinformation ci ON u.contact_id = ci.contact_id
LEFT JOIN
    EducationDetails e ON u.user_id = e.user_id
LEFT JOIN
    Institution i ON e.institution_id = i.institution_id
LEFT JOIN
    EducationSkills es ON e.education_id = es.education_id
LEFT JOIN
    Skills s ON es.skill_id = s.skill_id
LEFT JOIN
    ExperienceDetails ed ON u.user_id = ed.user_id
LEFT JOIN
    ExperienceSkills exs ON ed.experience_id = exs.experience_id
LEFT JOIN
    Skills s2 ON exs.skill_id = s2.skill_id
LEFT JOIN
    Company c ON ed.company_id = c.company_id
LEFT JOIN
    Posts p ON u.user_id = p.user_id
LEFT JOIN
    Comments co ON p.post_id = co.post_id
LEFT JOIN
    Likes l ON p.post_id = l.post_id;