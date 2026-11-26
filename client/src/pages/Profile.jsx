import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    location: "",
    profileVisibility: "public",
    availability: [],
    profilePhoto: "",
    skillsWanted: [],
  });

  const [originalUser, setOriginalUser] = useState({
    fullName: "",
    email: "",
    location: "",
    profileVisibility: "public",
    availability: [],
    profilePhoto: "",
    skillsWanted: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  // =====================
  // RATINGS
  // =====================

  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // =====================
  // LOAD USER
  // =====================

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (savedUser) {
      const userData = {
        fullName: savedUser.fullName || "",
        email: savedUser.email || "",
        location: savedUser.location || "",
        profileVisibility:
          savedUser.profileVisibility || "public",
        availability:
          savedUser.availability || [],
        profilePhoto:
          savedUser.profilePhoto || "",
        skillsWanted:
          savedUser.skillsWanted || [],
      };

      setUser(userData);
      setOriginalUser(userData);
    }
  }, []);

  // =====================
  // LOAD RATINGS
  // =====================

  useEffect(() => {
    const fetchRatings = async () => {
      if (!user.email) return;

      setRatingsLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5000/api/ratings/teacher/${encodeURIComponent(
            user.email
          )}`
        );

        const data = await response.json();

        if (response.ok) {
          setRatings(Array.isArray(data) ? data : []);
        } else {
          setRatings([]);
        }
      } catch (error) {
        console.log(
          "Rating Fetch Error:",
          error
        );
        setRatings([]);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchRatings();
  }, [user.email]);

  // =====================
  // AVERAGE RATING
  // =====================

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (total, item) =>
              total + Number(item.rating || 0),
            0
          ) / ratings.length
        ).toFixed(1)
      : "0.0";

  // =====================
  // HANDLE INPUT
  // =====================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================
  // PROFILE PHOTO
  // =====================

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size should be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        profilePhoto: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =====================
  // REMOVE PHOTO
  // =====================

  const handleRemovePhoto = () => {
    setUser((prev) => ({
      ...prev,
      profilePhoto: "",
    }));
  };

  // =====================
  // AVAILABILITY
  // =====================

  const handleAvailability = (value) => {
    setUser((prev) => {
      const alreadySelected =
        prev.availability.includes(value);

      const updatedAvailability = alreadySelected
        ? prev.availability.filter(
            (item) => item !== value
          )
        : [...prev.availability, value];

      return {
        ...prev,
        availability: updatedAvailability,
      };
    });
  };

  // =====================
  // ADD SKILL WANTED
  // =====================

  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) {
      alert("Please enter a skill.");
      return;
    }

    const alreadyExists =
      user.skillsWanted.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );

    if (alreadyExists) {
      alert("This skill is already added.");
      return;
    }

    setUser((prev) => ({
      ...prev,
      skillsWanted: [
        ...prev.skillsWanted,
        skill,
      ],
    }));

    setNewSkill("");
  };

  // =====================
  // REMOVE SKILL
  // =====================

  const handleRemoveSkill = (skillToRemove) => {
    setUser((prev) => ({
      ...prev,
      skillsWanted:
        prev.skillsWanted.filter(
          (skill) => skill !== skillToRemove
        ),
    }));
  };

  // =====================
  // SAVE PROFILE
  // =====================

  const handleSave = async () => {
    if (
      !user.fullName.trim() ||
      !user.email.trim()
    ) {
      alert("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalEmail: originalUser.email,
            fullName: user.fullName,
            email: user.email,
            location: user.location,
            profileVisibility:
              user.profileVisibility,
            availability:
              user.availability,
            profilePhoto:
              user.profilePhoto,
            skillsWanted:
              user.skillsWanted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Profile update failed"
        );
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "userName",
        data.user.fullName
      );

      localStorage.setItem(
        "userEmail",
        data.user.email
      );

      setUser(data.user);
      setOriginalUser(data.user);
      setNewSkill("");
      setIsEditing(false);

      alert(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.log(
        "Profile Update Error:",
        error
      );

      alert(
        "Unable to connect to server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // CANCEL
  // =====================

  const handleCancel = () => {
    setUser(originalUser);
    setNewSkill("");
    setIsEditing(false);
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* =====================
            BACK TO HOME
        ===================== */}

        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        {/* =====================
            HEADER
        ===================== */}

        <h1>My Profile</h1>

        {/* =====================
            PROFILE PHOTO
        ===================== */}

        <div className="profile-photo-section">

          <div className="profile-photo-wrapper">

            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt="Profile"
                className="profile-photo"
              />
            ) : (
              <div className="profile-photo-placeholder">
                👤
              </div>
            )}

          </div>

          {isEditing && (
            <div className="photo-buttons">

              <label
                htmlFor="profilePhotoInput"
                className="photo-upload-button"
              >
                📷 Choose Photo
              </label>

              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />

              {user.profilePhoto && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="remove-photo-button"
                >
                  Remove Photo
                </button>
              )}

            </div>
          )}

        </div>

        {/* =====================
            FULL NAME
        ===================== */}

        <div className="profile-field">

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />

        </div>

        {/* =====================
            EMAIL
        ===================== */}

        <div className="profile-field">

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your email"
          />

        </div>

        {/* =====================
            LOCATION
        ===================== */}

        <div className="profile-field">

          <label>Location</label>

          <input
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your city / location"
          />

        </div>

        {/* =====================
            PROFILE VISIBILITY
        ===================== */}

        <div className="profile-field">

          <label>Profile Visibility</label>

          <select
            name="profileVisibility"
            value={user.profileVisibility}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="public">
              Public
            </option>

            <option value="private">
              Private
            </option>
          </select>

        </div>

        {/* =====================
            AVAILABILITY
        ===================== */}

        <div className="profile-field">

          <label>Availability</label>

          <div className="availability-options">

            {[
              "Weekdays",
              "Weekends",
              "Morning",
              "Evening",
            ].map((item) => (
              <label key={item}>

                <input
                  type="checkbox"
                  checked={user.availability.includes(
                    item
                  )}
                  onChange={() =>
                    handleAvailability(item)
                  }
                  disabled={!isEditing}
                />

                <span>{item}</span>

              </label>
            ))}

          </div>

        </div>

        {/* =====================
            SKILLS WANTED
        ===================== */}

        <div className="profile-field">

          <label>Skills Wanted</label>

          {isEditing && (
            <div className="wanted-skill-input">

              <input
                type="text"
                value={newSkill}
                onChange={(e) =>
                  setNewSkill(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Enter a skill you want to learn"
              />

              <button
                type="button"
                onClick={handleAddSkill}
              >
                + Add
              </button>

            </div>
          )}

          <div className="wanted-skills-list">

            {user.skillsWanted.length > 0 ? (
              user.skillsWanted.map(
                (skill, index) => (
                  <div
                    key={`${skill}-${index}`}
                    className="wanted-skill"
                  >

                    <span>{skill}</span>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveSkill(skill)
                        }
                        title="Remove skill"
                      >
                        ×
                      </button>
                    )}

                  </div>
                )
              )
            ) : (
              <p className="no-skills">
                No skills added yet.
              </p>
            )}

          </div>

        </div>

        {/* =====================
            BUTTONS
        ===================== */}

        <div className="profile-buttons">

          {!isEditing ? (
            <button
              onClick={() =>
                setIsEditing(true)
              }
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}

        </div>

        {/* =================================================
            RATING & FEEDBACK
        ================================================= */}

        <div className="profile-rating-section">

          <div className="rating-section-title">

            <h2>Rating & Feedback</h2>

            <p>
              Feedback received from skill learners
            </p>

          </div>

          {/* SUMMARY */}

          <div className="rating-summary">

            <div className="average-rating">

              <div className="average-number">
                {averageRating}
              </div>

              <div className="average-stars">

                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <=
                      Math.round(
                        Number(averageRating)
                      )
                        ? "star active"
                        : "star"
                    }
                  >
                    ★
                  </span>
                ))}

              </div>

              <div className="review-count">

                {ratings.length}{" "}

                {ratings.length === 1
                  ? "Review"
                  : "Reviews"}

              </div>

            </div>

          </div>

          {/* REVIEWS */}

          <div className="reviews-list">

            {ratingsLoading ? (

              <p className="rating-message">
                Loading ratings...
              </p>

            ) : ratings.length === 0 ? (

              <div className="no-ratings">

                <div className="no-rating-icon">
                  ★
                </div>

                <h3>No ratings yet</h3>

                <p>
                  Complete skill exchanges to
                  receive ratings and feedback.
                </p>

              </div>

            ) : (

              ratings.map((item) => (

                <div
                  className="review-card"
                  key={item._id}
                >

                  <div className="review-header">

                    <div className="reviewer-info">

                      <div className="reviewer-avatar">

                        {(
                          item.reviewerName ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <h3>
                          {item.reviewerName ||
                            "Anonymous"}
                        </h3>

                        <span>
                          {item.skillName}
                        </span>

                      </div>

                    </div>

                    <div className="review-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <span
                            key={star}
                            className={
                              star <=
                              Number(item.rating)
                                ? "star active"
                                : "star"
                            }
                          >
                            ★
                          </span>
                        )
                      )}

                    </div>

                  </div>

                  {item.feedback && (
                    <p className="review-feedback">
                      "{item.feedback}"
                    </p>
                  )}

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;