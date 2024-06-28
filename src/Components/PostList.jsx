import React, { useState, useEffect } from 'react';
import '../Styles/PostsList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../assets/jologo.png'

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [popupdetails, setPopupDetails] = useState([]);
    const [showCommentsPopup, setShowCommentsPopup] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:3000/app/v1/posts/feed', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const postsData = await response.json();

                const postsWithDetails = await Promise.all(postsData.map(async (post) => {
                    // Fetch additional details for each post
                    const userDetailsResponse = await fetch('http://localhost:3000/app/v1/posts/postDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify({ token, postId: post.post_id }),
                    });

                    if (!userDetailsResponse.ok) {
                        throw new Error('Failed to fetch user details');
                    }

                    const userDetails = await userDetailsResponse.json();

                    // Fetch likes count
                    const likesResponse = await fetch(`http://localhost:3000/app/v1/likes/post/${post.post_id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                    });

                    if (!likesResponse.ok) {
                        throw new Error('Failed to fetch likes');
                    }

                    const likes = await likesResponse.json();
                    const likesCount = likes.length;

                    // Fetch comments count and details
                    const noofcommentsResponse = await fetch('http://localhost:3000/app/v1/comments/post/getComments', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify({ token, post_id: post.post_id }),
                    });

                    if (!noofcommentsResponse.ok) {
                        throw new Error('Failed to fetch comments');
                    }

                    const comments = await noofcommentsResponse.json();
                    const commentsCount = comments.length;

                    return {
                        post_id: post.post_id,
                        description: post.description,
                        created_at: post.created_at,
                        userName: `${userDetails.first_name} ${userDetails.last_name}`,
                        userId: userDetails.user_id,
                        likesCount,
                        userLiked: likes.some(like => like.user_id === JSON.parse(atob(token.split('.')[1])).userId),
                        commentsCount,
                    };
                }));

                setPosts(postsWithDetails);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const toggleLike = async (postId, userLiked) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:3000/app/v1/likes/like/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            const result = await response.json();

            setPosts(posts => posts.map(post =>
                post.post_id === postId ? {
                    ...post,
                    likesCount: userLiked ? post.likesCount - 1 : post.likesCount + 1,
                    userLiked: !userLiked
                } : post
            ));

            toast.success(result.message);
        } catch (error) {
            console.error('Error toggling like:', error);
            setError(error.message);
        }
    };

    const handleProfileClick = async (userId) => {
        const token = localStorage.getItem('token');

        try {
            const userDetailsResponse = await fetch('http://localhost:3000/app/v1/userauth/profile/getDetailsByIdOfUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ user_id: userId, token }),
            });

            if (!userDetailsResponse.ok) {
                throw new Error('Failed to fetch user details');
            }

            const popeddetails = await userDetailsResponse.json();
            setPopupDetails(popeddetails);
            setShowProfilePopup(true);
        } catch (error) {
            console.error('Error fetching user details for profile click:', error);
            setError(error.message);
        }
    };

    const handleCommentsClick = async (postId) => {
        const token = localStorage.getItem('token');

        try {
            const commentsResponse = await fetch('http://localhost:3000/app/v1/comments/post/getComments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ token, post_id: postId }),
            });

            if (!commentsResponse.ok) {
                throw new Error('Failed to fetch comments');
            }

            const commentsData = await commentsResponse.json();
            setComments(commentsData);
            setShowCommentsPopup(true);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError(error.message);
        }
    };

    const handleAddComment = async (postId) => {
        console.log('Post ID:', postId);
        const token = localStorage.getItem('token');

        try {
            console.log('Token:', token);
            console.log('Post ID:', postId);
            console.log('Comment:', commentInput);

            const response = await fetch('http://localhost:3000/app/v1/comments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ token, postId, description: commentInput }),
            });

            console.log('Response:', response);

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to add comment: ${errorMessage}`);
            }

            const updatedCommentsResponse = await fetch('http://localhost:3000/app/v1/comments/post/getComments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ token, post_id: postId }),
            });

            if (!updatedCommentsResponse.ok) {
                throw new Error('Failed to fetch updated comments');
            }

            const updatedCommentsData = await updatedCommentsResponse.json();
            toast.success('Comment added successfully');
            setTimeout(() =>
                window.location.reload()
                , 3000);
            setComments(updatedCommentsData);
        } catch (error) {
            console.error('Error adding comment:', error);
            setError(error.message);
        }
    };



    if (loading) {
        return <div>
            <p className="loading-message"
                style={{
                    color: 'black',
                    fontSize: '30px',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    marginTop: '15%',
                }}
            >Loading....</p>
            <img src={image} alt="loading" style={{ width: '500px', height: '500px' }} />
        </div>
    }

    if (error) {
        return <p className="error-message">Error: {error}</p>;
        
    }

    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="post-list">
                <h1
                    style={{
                        color: 'black',
                        fontSize: '30px',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        marginTop: '15%',
                    }}
                >Posts</h1>
                <div className="post-container">
                    {posts.map(post => (
                        <div key={post.post_id} className="post-card">
                            <div className="post-content">
                                <div className="post-header">
                                    <p className="post-author" onClick={() => handleProfileClick(post.userId)}>
                                        {post.userName}
                                    </p>
                                    <p className="post-date">Created at: {new Date(post.created_at).toLocaleString()}</p>
                                </div>
                                <p className="post-description">{post.description}</p>
                                <div className="post-footer">
                                    <div className="post-interactions">
                                        <p className="post-likes" onClick={() => toggleLike(post.post_id, post.userLiked)}>
                                            <FontAwesomeIcon icon={faThumbsUp} style={{ color: post.userLiked ? 'blue' : 'gray' }} /> {post.likesCount}
                                        </p>
                                        <p className="post-comments" onClick={() => handleCommentsClick(post.post_id)}>
                                            <FontAwesomeIcon icon={faCommentDots} /> {post.commentsCount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {showProfilePopup && (
                    <ProfileDetailsPopup
                        userDetails={popupdetails}
                        onClose={() => setShowProfilePopup(false)}
                    />
                )}
                {showCommentsPopup && (
                    <CommentsPopup
                        comments={comments}
                        onClose={() => setShowCommentsPopup(false)}
                        postId={comments.length > 0 ? comments[0].post_id : null}
                        commentInput={commentInput}
                        setCommentInput={setCommentInput}
                        handleAddComment={handleAddComment}
                    />
                )}

            </div>
        </div>
    );
};

const ProfileDetailsPopup = ({ userDetails, onClose }) => {
    const { user = {}, educationDetails = [], experienceDetails = [] } = userDetails;

    return (
        <div className="profile-popup">
            <div className="profile-popup-content">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.first_name?.slice(0, 1) + user.last_name?.slice(0, 1)}
                    </div>
                    <h2>{user.first_name.slice(0, 1)} {user.last_name.slice(0, 5)}</h2>
                    <p className="profile-close" onClick={onClose}
                        style={{
                            color: 'black',
                            fontSize: '20px',
                            cursor: 'pointer',
                            right: '10px',
                            marginLeft: '50%',
                        }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </p>
                </div>
                <div className="profile-details">
                    <p style={{ color: 'black' }}><strong>Email:</strong> {user.email ?? 'No email'}</p>
                    <p style={{ color: 'black' }}><strong>Website:</strong> <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website ?? 'No website'}</a></p>

                    <div className="education-section">
                        <h3>Education</h3>
                        {educationDetails.length > 0 ? (
                            educationDetails.map(education => (
                                <div key={education.education_id} className="education-card">
                                    <p className="card-title"><strong>Institution:</strong> {education.institution_name ?? 'No institution name'}</p>
                                    <p style={{ color: 'black' }}><strong>Branch:</strong> {education.institution_branch ?? 'No institution branch'}</p>
                                    <p style={{ color: 'black' }}><strong>Degree:</strong> {education.degree ?? 'No degree'}</p>
                                    <p style={{ color: 'black' }}><strong>School:</strong> {education.school ?? 'No school'}</p>
                                    <p style={{ color: 'black' }}><strong>Start Date:</strong> {new Date(education.start_date)?.toLocaleDateString() ?? 'No start date'}</p>
                                    <p style={{ color: 'black' }}><strong>End Date:</strong> {new Date(education.end_date)?.toLocaleDateString() ?? 'No end date'}</p>
                                    <p style={{ color: 'black' }}><strong>Grade:</strong> {education.grade ?? 'No grade'}</p>
                                    <p style={{ color: 'black' }}><strong>Description:</strong> {education.description ?? 'No description'}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No education details available</p>
                        )}
                    </div>

                    <div className="experience-section">
                        <h3>Experience</h3>
                        {experienceDetails.length > 0 ? (
                            experienceDetails.map(experience => (
                                <div key={experience.experience_id} className="experience-card">
                                    <p className="card-title" style={{ color: 'black' }}><strong>Company:</strong> {experience.company_name ?? 'No company name'}</p>
                                    <p style={{ color: 'black' }}><strong>Branch:</strong> {experience.company_branch ?? 'No company branch'}</p>
                                    <p style={{ color: 'black' }}><strong>Role:</strong> {experience.job_role ?? 'No job role'}</p>
                                    <p style={{ color: 'black' }}><strong>Start Date:</strong> {new Date(experience.start_date)?.toLocaleDateString() ?? 'No start date'}</p>
                                    <p style={{ color: 'black' }}><strong>End Date:</strong> {new Date(experience.end_date)?.toLocaleDateString() ?? 'No end date'}</p>
                                    <p style={{ color: 'black' }}><strong>Description:</strong> {experience.description ?? 'No description'}</p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'black' }}>No experience details available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommentsPopup = ({ comments, onClose, postId, commentInput, setCommentInput, handleAddComment }) => {
    console.log('Comments:', comments);
    console.log('Post ID:', postId);

    const handleChange = (e) => {
        setCommentInput(e.target.value);
    };

    const handleSubmit = () => {
        handleAddComment(postId);
        setCommentInput('');
    };

    return (
        <div style={styles.popupContainer}>
            <div style={styles.popupContent}>
                <div style={styles.popupHeader}>
                    <h3 style={styles.popupTitle}>Comments</h3>
                    <button style={styles.closeButton} onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div style={styles.commentsContainer}>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.comment_id} style={styles.comment}>
                                <p style={styles.commentAuthor}><strong>{comment.first_name} {comment.last_name}</strong></p>
                                <p style={styles.commentDescription}>{comment.description}</p>
                                <p style={styles.commentDate}><small>{new Date(comment.created_at).toLocaleString()}</small></p>
                            </div>
                        ))
                    ) : (
                        <p style={styles.noComments}>No comments available</p>
                    )}
                </div>
                <div style={styles.addCommentContainer}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInput}
                        onChange={handleChange}
                        style={styles.commentInput}
                    />
                    <button
                        onClick={handleSubmit}
                        style={styles.commentButton}
                    >
                        Add Comment
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    popupContainer: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        marginTop: '10%',
        marginRight: '10%',


    },
    popupContent: {
        padding: '20px',
    },
    popupHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '10px',
    },
    popupTitle: {
        margin: 0,
        fontSize: '20px',
        color: '#333',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: 'black',
        marginLeft: '50%',
    },
    commentsContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
    },
    comment: {
        borderBottom: '1px solid #eee',
        padding: '10px 0',
    },
    commentAuthor: {
        margin: 0,
        fontSize: '16px',
        color: '#333',
    },
    commentDescription: {
        margin: '5px 0',
        fontSize: '14px',
        color: '#555',
    },
    commentDate: {
        margin: 0,
        fontSize: '12px',
        color: '#999',
    },
    noComments: {
        fontSize: '14px',
        color: '#555',
        textAlign: 'center',
    },
    addCommentContainer: {
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    commentInput: {
        flex: 1,
        padding: '8px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    commentButton: {
        padding: '8px 16px',
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default PostList;
