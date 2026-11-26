import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");

  // =========================================================
  // FETCH ALL SKILLS
  // =========================================================
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/skills/all"
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(
            data.message || "Failed to load skills."
          );
          return;
        }

        const currentUserEmail =
          localStorage.getItem("userEmail");

        const formattedSkills = data
          .filter((item) => {
            // Hide current user's own skills
            if (
              currentUserEmail &&
              item.userEmail?.toLowerCase() ===
                currentUserEmail.toLowerCase()
            ) {
              return false;
            }

            return true;
          })
          .map((item) => ({
            id: item._id,
            skill: item.skillName || "Skill",
            category: item.category || "Other",
            level: item.level || "Beginner",
            description:
              item.description ||
              "No description available.",
            teacherEmail: item.userEmail || "",
            teacherName:
              item.userName || "SkillSwap User",

            // Use actual backend values if available.
            // Otherwise keep them empty instead of creating fake data.
            availability:
              item.availability || "",
            skillsWanted:
              item.skillsWanted || "",
            rating:
              item.rating ?? item.averageRating ?? null,
            profilePhoto:
              item.profilePhoto || "",
          }));

        setSkills(formattedSkills);
        setFilteredSkills(formattedSkills);
      } catch (error) {
        console.error("HOME SKILLS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // =========================================================
  // SEARCH + CATEGORY + AVAILABILITY FILTER
  // =========================================================
  const handleSearch = () => {
    let result = [...skills];

    // CATEGORY
    if (category !== "all") {
      result = result.filter(
        (item) =>
          item.category?.toLowerCase() ===
          category.toLowerCase()
      );
    }

    // AVAILABILITY
    if (availability !== "all") {
      result = result.filter((item) => {
        if (!item.availability) return false;

        return item.availability
          .toLowerCase()
          .includes(availability.toLowerCase());
      });
    }

    // SEARCH
    if (search.trim() !== "") {
      const searchText = search.toLowerCase();

      result = result.filter((item) => {
        return (
          item.skill?.toLowerCase().includes(searchText) ||
          item.teacherName
            ?.toLowerCase()
            .includes(searchText) ||
          item.category
            ?.toLowerCase()
            .includes(searchText) ||
          item.description
            ?.toLowerCase()
            .includes(searchText)
        );
      });
    }

    setFilteredSkills(result);
  };

  // =========================================================
  // REQUEST SKILL
  // Home → Skill Details
  // =========================================================
  const handleRequest = (skillData) => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/skill-details", {
      state: {
        skill: skillData.skill,
        category: skillData.category,
        level: skillData.level,
        skillId: skillData.id,
        teacherEmail: skillData.teacherEmail,
        teacherName: skillData.teacherName,
        description: skillData.description,
        availability: skillData.availability,
        skillsWanted: skillData.skillsWanted,
        rating: skillData.rating,
      },
    });
  };

  // =========================================================
  // VIEW ALL
  // =========================================================
  const handleViewAll = () => {
    navigate("/skills");
  };

  // =========================================================
  // LOGIN / LOGOUT
  // =========================================================
  const isLoggedIn =
    localStorage.getItem("isLoggedIn");

  const handleAuthButton = () => {
    if (isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");

      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  // =========================================================
  // PROFILE INITIAL
  // =========================================================
  const getInitial = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="home-page">

      {/* =====================================================
          HEADER
          ===================================================== */}
      <header className="home-header">

        <div className="home-brand">
          <div className="home-brand-icon">
            SS
          </div>

          <div>
            <h1>SkillSwap</h1>
            <span>Learn. Share. Grow.</span>
          </div>
        </div>

        <div className="home-header-actions">

  {!isLoggedIn && (
    <button
      type="button"
      className="home-header-btn secondary"
      onClick={() => navigate("/signup")}
    >
      Sign Up
    </button>
  )}

  {!isLoggedIn ? (
    <button
      type="button"
      className="home-header-btn primary"
      onClick={() => navigate("/login")}
    >
      Login
    </button>
  ) : (
    <button
      type="button"
      className="home-header-btn primary"
      onClick={handleAuthButton}
    >
      Logout
    </button>
  )}

</div>

      </header>


      {/* =====================================================
          HERO / INTRO
          ===================================================== */}
      <section className="home-hero">

        <div className="home-hero-content">

          <span className="home-small-label">
            SKILL EXCHANGE PLATFORM
          </span>

          <h2>
            Skill Swap Platform
          </h2>

          <p>
            Discover people, exchange skills and
            learn something new.
          </p>

        </div>

      </section>


      {/* =====================================================
          SEARCH SECTION
          ===================================================== */}
      <section className="home-search-section">

        <div className="home-search-box">

          {/* CATEGORY */}
          <div className="home-filter-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <option value="all">
                All Skills
              </option>

              <option value="programming">
                Programming
              </option>

              <option value="design">
                Design
              </option>

              <option value="creative">
                Creative
              </option>

              <option value="language">
                Language
              </option>

              <option value="business">
                Business
              </option>

              <option value="other">
                Other
              </option>
            </select>

          </div>


          {/* AVAILABILITY */}
          <div className="home-filter-group">

            <label>
              Availability
            </label>

            <select
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value)
              }
            >
              <option value="all">
                Any Availability
              </option>

              <option value="weekends">
                Weekends
              </option>

              <option value="evenings">
                Evenings
              </option>

              <option value="weekdays">
                Weekdays
              </option>
            </select>

          </div>


          {/* SEARCH */}
          <div className="home-search-input-group">

            <label>
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search for skills..."
            />

          </div>


          {/* SEARCH BUTTON */}
          <button
            type="button"
            className="home-search-button"
            onClick={handleSearch}
          >
            Search
          </button>

        </div>

      </section>


      {/* =====================================================
          SKILLS SECTION
          ===================================================== */}
      <section className="home-skills-section">

        <div className="home-section-heading">

          <div>
            <h2>
              Find a Skill to Learn
            </h2>

            <p>
              Explore skills offered by our community.
            </p>
          </div>

          <button
            type="button"
            className="home-view-all-btn"
            onClick={handleViewAll}
          >
            View All
          </button>

        </div>


        {/* ===================================================
            LOADING
            =================================================== */}
        {loading && (
          <div className="home-empty-state">
            <div className="home-loader"></div>

            <p>
              Loading skills...
            </p>
          </div>
        )}


        {/* ===================================================
            NO SKILLS
            =================================================== */}
        {!loading &&
          filteredSkills.length === 0 && (
            <div className="home-empty-state">

              <div className="home-empty-icon">
                🔍
              </div>

              <h3>
                No Skills Available
              </h3>

              <p>
                Try another skill or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setAvailability("all");
                  setFilteredSkills(skills);
                }}
              >
                Clear Filters
              </button>

            </div>
          )}


        {/* ===================================================
            USER / SKILL CARDS
            =================================================== */}
        {!loading &&
          filteredSkills.length > 0 && (
            <div className="home-skill-list">

              {filteredSkills
                .slice(0, 6)
                .map((item) => (

                  <article
                    className="home-user-card"
                    key={item.id}
                  >

                    {/* PROFILE */}
                    <div className="home-user-profile">

                      {item.profilePhoto ? (
                        <img
                          src={item.profilePhoto}
                          alt={item.teacherName}
                          className="home-profile-image"
                        />
                      ) : (
                        <div className="home-profile-avatar">
                          {getInitial(item.teacherName)}
                        </div>
                      )}

                      <div className="home-user-info">

                        <h3>
                          {item.teacherName}
                        </h3>

                        <span>
                          {item.teacherEmail}
                        </span>

                      </div>

                    </div>


                    {/* SKILLS OFFERED */}
                    <div className="home-card-column">

                      <span className="home-column-label">
                        Skills Offered
                      </span>

                      <h3 className="home-skill-name">
                        {item.skill}
                      </h3>

                      <div className="home-skill-tags">

                        <span className="home-category-tag">
                          {item.category}
                        </span>

                        <span className="home-level-tag">
                          {item.level}
                        </span>

                      </div>

                    </div>


                    {/* SKILLS WANTED */}
                    <div className="home-card-column">

                      <span className="home-column-label">
                        Skills Wanted
                      </span>

                      <p className="home-wanted-text">
                        {item.skillsWanted ||
                          "Not specified"}
                      </p>

                    </div>


                    {/* AVAILABILITY */}
                    <div className="home-card-column">

                      <span className="home-column-label">
                        Availability
                      </span>

                      <p className="home-availability">
                        {item.availability ||
                          "Not specified"}
                      </p>

                    </div>


                    {/* RATING + REQUEST */}
                    <div className="home-card-action">

                      <div className="home-rating">

                        <span className="home-star">
                          ★
                        </span>

                        <span>
                          {item.rating !== null &&
                          item.rating !== undefined
                            ? Number(item.rating).toFixed(1)
                            : "—"}
                        </span>

                      </div>

                      <button
                        type="button"
                        className="home-request-button"
                        onClick={() =>
                          handleRequest(item)
                        }
                      >
                        Request
                      </button>

                    </div>

                  </article>

                ))}

            </div>
          )}


        {/* ===================================================
            PAGINATION
            =================================================== */}
        {!loading &&
          filteredSkills.length > 0 && (
            <div className="home-pagination">

              <button type="button">
                ‹
              </button>

              <button
                type="button"
                className="active-page"
              >
                1
              </button>

              <button type="button">
                2
              </button>

              <button type="button">
                3
              </button>

              <button type="button">
                4
              </button>

              <button type="button">
                5
              </button>

              <button type="button">
                ›
              </button>

            </div>
          )}

      </section>

    </div>
  );
}

export default Home;