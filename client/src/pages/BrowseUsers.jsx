import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrowseUsers.css";

function BrowseUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // ===================== FETCH USERS =====================

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (location.trim()) {
        params.append("location", location.trim());
      }

      const response = await fetch(
        `http://localhost:5000/api/users?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load users");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.log("Browse Users Error:", error);
      alert("Server is not connected");
    } finally {
      setLoading(false);
    }
  };

  // ===================== LOAD USERS =====================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===================== SEARCH =====================

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // ===================== REQUEST SKILL SWAP =====================

  const handleRequest = (person) => {
    const offeredSkill =
      person.skillsOffered && person.skillsOffered.length > 0
        ? person.skillsOffered[0]
        : "";

    navigate("/request-skill", {
      state: {
        teacherEmail: person.email,
        teacherName: person.fullName,
        skill:
          typeof offeredSkill === "string"
            ? offeredSkill
            : offeredSkill?.name || "",
      },
    });
  };

  return (
    <div className="browse-page">

      {/* ===================== HERO ===================== */}

      <section className="browse-hero">
        <div>
          <span className="browse-badge">
            ✨ SkillSwap Community
          </span>

          <h1>
            Find Your
            <span> Skill Match</span>
          </h1>

          <p>
            Discover people who can teach what you want
            to learn and share your skills with others.
          </p>
        </div>
      </section>

      {/* ===================== SEARCH ===================== */}

      <form
        className="browse-search"
        onSubmit={handleSearch}
      >
        <div className="search-input">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="search-input">
          <span>📍</span>

          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button type="submit">
          Search
        </button>
      </form>

      {/* ===================== RESULT TITLE ===================== */}

      <div className="result-header">
        <div>
          <h2>
            People you can learn from
          </h2>

          <p>
            {users.length} public profile
            {users.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      {/* ===================== LOADING ===================== */}

      {loading && (
        <div className="status-box">
          <div className="loader"></div>

          <p>
            Finding skill matches...
          </p>
        </div>
      )}

      {/* ===================== NO USERS ===================== */}

      {!loading && users.length === 0 && (
        <div className="empty-box">
          <div className="empty-icon">
            🔎
          </div>

          <h3>
            No users found
          </h3>

          <p>
            Try searching for another skill or location.
          </p>
        </div>
      )}

      {/* ===================== USERS ===================== */}

      {!loading && users.length > 0 && (
        <div className="users-grid">

          {users.map((person) => (
            <div
              className="user-card"
              key={person._id}
            >

              {/* ===================== USER HEADER ===================== */}

              <div className="user-header">

                <div className="user-avatar">
                  {person.fullName
                    ? person.fullName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <div className="user-basic">
                  <h3>
                    {person.fullName}
                  </h3>

                  <p>
                    📍{" "}
                    {person.location ||
                      "Location not added"}
                  </p>
                </div>

              </div>

              {/* ===================== USER DETAILS ===================== */}

              <div className="user-details">

                {/* OFFERED SKILLS */}

                <div className="skill-block">
                  <div className="skill-title">
                    <span>🎯</span>
                    Skills Offered
                  </div>

                  <div className="tags">
                    {person.skillsOffered &&
                    person.skillsOffered.length > 0 ? (
                      person.skillsOffered.map(
                        (skill, index) => (
                          <span
                            className="skill-tag offered"
                            key={index}
                          >
                            {typeof skill === "string"
                              ? skill
                              : skill.name}
                          </span>
                        )
                      )
                    ) : (
                      <span className="muted">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>

                {/* WANTED SKILLS */}

                <div className="skill-block">
                  <div className="skill-title">
                    <span>💡</span>
                    Wants to Learn
                  </div>

                  <div className="tags">
                    {person.skillsWanted &&
                    person.skillsWanted.length > 0 ? (
                      person.skillsWanted.map(
                        (skill, index) => (
                          <span
                            className="skill-tag wanted"
                            key={index}
                          >
                            {typeof skill === "string"
                              ? skill
                              : skill.name}
                          </span>
                        )
                      )
                    ) : (
                      <span className="muted">
                        Not specified
                      </span>
                    )}
                  </div>
                </div>

                {/* AVAILABILITY */}

                <div className="availability">
                  <span>
                    🕒 Available
                  </span>

                  <div>
                    {person.availability &&
                    person.availability.length > 0 ? (
                      person.availability.map(
                        (item, index) => (
                          <small key={index}>
                            {item}
                          </small>
                        )
                      )
                    ) : (
                      <small>
                        Flexible
                      </small>
                    )}
                  </div>
                </div>

              </div>

              {/* ===================== REQUEST ===================== */}

              <button
                className="request-btn"
                type="button"
                onClick={() => handleRequest(person)}
              >
                Request Skill Swap
                <span>→</span>
              </button>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default BrowseUsers;