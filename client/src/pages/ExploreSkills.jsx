import { useEffect, useState } from "react";
import SkillCard from "../components/SkillCard";
import "./ExploreSkills.css";

function ExploreSkills() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // ======================================================
  // LOAD ALL APPROVED SKILLS
  // ======================================================
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch(
          "http://localhost:5000/api/skills/all"
        );

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(
            data.message || "Failed to load skills."
          );
          return;
        }

        // ==================================================
        // CURRENT LOGGED-IN USER
        // ==================================================
        const currentUserEmail =
          localStorage.getItem("userEmail");

        // ==================================================
        // FORMAT MONGODB DATA
        // ==================================================
// ==================================================
// FORMAT MONGODB DATA
// ==================================================

const formattedSkills = data.map((item) => ({
  id: item._id,

  skill: item.skillName || "",

  category: item.category || "",

  level: item.level || "",

  description: item.description || "",

  teacherEmail: item.userEmail || "",

  teacherName:
    item.userName || "SkillSwap User",
}));

setSkills(formattedSkills);

        setSkills(formattedSkills);
      } catch (error) {
        console.error("LOAD SKILLS ERROR:", error);

        setErrorMessage(
          "Server is not connected."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // ======================================================
  // SEARCH + FILTER
  // ======================================================
  const filteredSkills = skills.filter((item) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      searchText === "" ||
      item.skill
        ?.toLowerCase()
        .includes(searchText) ||
      item.category
        ?.toLowerCase()
        .includes(searchText) ||
      item.level
        ?.toLowerCase()
        .includes(searchText) ||
      item.teacherName
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "" ||
      item.category === category;

    const matchesLevel =
      level === "" ||
      item.level === level;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel
    );
  });

  // ======================================================
  // CLEAR SEARCH + FILTERS
  // ======================================================
  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
  };

  return (
    <div className="explore-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}
      <div className="explore-header">

        <h1>
          Explore Skills
        </h1>

        <p>
          Browse skills offered by other users
          and find someone to learn from.
        </p>

      </div>

      {/* ==================================================
          SEARCH + FILTER
      ================================================== */}
      <div className="explore-search-box">

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            All Categories
          </option>

          <option value="Programming">
            Programming
          </option>

          <option value="Design">
            Design
          </option>

          <option value="Creative">
            Creative
          </option>

          <option value="Language">
            Language
          </option>

          <option value="Business">
            Business
          </option>

          <option value="Other">
            Other
          </option>
        </select>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search skills or users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* LEVEL */}
        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
        >
          <option value="">
            All Levels
          </option>

          <option value="Beginner">
            Beginner
          </option>

          <option value="Intermediate">
            Intermediate
          </option>

          <option value="Advanced">
            Advanced
          </option>
        </select>

        {/* CLEAR */}
        {(search || category || level) && (
          <button
            type="button"
            onClick={handleClearFilters}
          >
            Clear
          </button>
        )}

      </div>

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}
      {errorMessage && (
        <div className="form-message error">
          {errorMessage}
        </div>
      )}

      {/* ==================================================
          RESULT COUNT
      ================================================== */}
      {!loading && !errorMessage && (
        <div className="explore-result-info">
          {filteredSkills.length} Skills Found
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}
      {loading ? (

        <div className="skills-empty-state">

          <h2>
            Loading Skills...
          </h2>

          <p>
            Please wait while we find
            available skills.
          </p>

        </div>

      ) : (

        <div className="skills-grid">

          {/* =================================================
              NO RESULTS
          ================================================= */}
          {filteredSkills.length === 0 ? (

            <div className="skills-empty-state">

              <h2>
                No Skills Found
              </h2>

              <p>
                Try another skill, category,
                or level.
              </p>

              {(search || category || level) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </button>
              )}

            </div>

          ) : (

            /* ===============================================
               SKILL CARDS
            =============================================== */
            filteredSkills.map((item) => (

              <SkillCard
                key={item.id}

                skill={item.skill}

                category={item.category}

                level={item.level}

                skillId={item.id}

                teacherEmail={item.teacherEmail}

                teacherName={item.teacherName}

                description={item.description}
              />

            ))

          )}

        </div>

      )}

    </div>
  );
}

export default ExploreSkills;