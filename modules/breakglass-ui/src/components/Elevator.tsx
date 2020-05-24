import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

// @ts-ignore
import conf from "../conf.yaml";

export default ({ onError, onGlassBroken, token }) => {
  const [modalActive, setModalActive] = useState(false);

  const [user, setUser] = useState("");

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [project, setProject] = useState("");

  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [role, setRole] = useState("");

  const [reasoning, setReasoning] = useState("");

  const [hours, setHours] = useState(2);

  function isEmailValid() {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user);
  }

  async function fetchProjects() {
    setLoadingProjects(true);
    console.log("Fetching projects");
    try {
      const response = await axios
        .get("/getProjects", {
          headers: {
            "x-access-token": token,
          },
        })
        .catch((err) => {
          throw new Error(err);
        });

      const projs = response.data.map((p) => p.id);
      setProjects(projs);
      setLoadingProjects(false);
    } catch (err) {
      onError(err.message);
    }
  }

  async function fetchRoles() {
    if (project.length > 0) {
      setLoadingRoles(true);
      const response = await axios
        .get("/getRoles/" + project, {
          headers: {
            "x-access-token": token,
          },
        })
        .catch((err) => {
          throw new Error(err);
        });
      setRoles(response.data);
      setLoadingRoles(false);
    }
  }

  function onSubmit() {
    setModalActive(true);
  }

  function onCancel() {
    setProject("");
    setRole("");
    setHours(1);
    setReasoning("");
  }

  function onBreakGlass() {
    onGlassBroken({
      user,
      project,
      role,
      hours,
      reasoning,
    });
    onCancel();
  }

  useEffect(() => {
    const decoded = jwtDecode(token);
    fetchProjects();
    setRole("");
    setUser(decoded.email);
    console.log(token);
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [project]);

  return (
    <div>
      <div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left has-icons-right">
          <input
            className={isEmailValid() ? "input" : "input is-danger"}
            type="email"
            disabled
            placeholder="Email input"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
          {!isEmailValid() && (
            <span className="icon is-small is-right">
              <i className="fas fa-exclamation-triangle"></i>
            </span>
          )}
        </div>
        {!isEmailValid() && (
          <p className="help is-danger">This email is invalid</p>
        )}
      </div>

      <div className="field">
        <div className="control">
          <label className="label">Project</label>
          <div className={loadingProjects ? "select is-loading" : "select"}>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option>Choose a project</option>
              {projects.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="label">Role</label>
          <div className={loadingRoles ? "select is-loading" : "select"}>
            <select
              value={role}
              disabled={project.length > 0 ? false : true}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Select a role</option>
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">
          <span>Hours Needed</span>
        </label>

        <div className="field-body">
          <div className="field">
            <div className="control">
              <input
                className="input"
                min="1"
                placeholder="Enter the number of hours"
                required
                type="number"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Reasoning</label>
        <div className="control">
          <textarea
            className="textarea"
            placeholder="Why are you elevating your permissions?"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={onSubmit}>
            Submit
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-light" onClick={onCancel}>
            Clear
          </button>
        </div>
      </div>

      <div className={modalActive ? "modal is-active" : "modal"}>
        <div className="modal-background"></div>
        <div className="modal-content">
          <article className="panel card is-danger">
            <p className="panel-heading">Are You Sure?</p>

            <a className="panel-block">
              <b>User&emsp;</b>
              <p>{user}</p>
            </a>

            <a className="panel-block">
              <b>Project&emsp;</b>
              <p>{project}</p>
            </a>

            <a className="panel-block">
              <b>Role&emsp;</b>
              <p>{role}</p>
            </a>

            <a className="panel-block">
              <b>Timeframe&emsp;</b>
              <p>{hours} hours</p>
            </a>

            <div className="panel-block">
              <div className="field is-grouped">
                <div className="control">
                  <button
                    className="button is-danger is-link"
                    onClick={onBreakGlass}
                  >
                    Break the Glass
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-link is-light"
                    onClick={() => setModalActive(false)}
                  >
                    Wait
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={() => setModalActive(false)}
        ></button>
      </div>
    </div>
  );
};
