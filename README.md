# Spec-Driven Development w Gemini CLI

This repo has some basic assets to experiment **Spec-Driven Development** using the Gemini CLI. You will act as a developer going from a raw Functional Specification to a deployed Pull Request in a single session.

## Assets

* `.gemini/commands/`: Contains configuration files for custom commands (`techspec`, `plan`, `build`).
* `GEMINI.md`: Contains project rules and guidelines.
* `.github/workflows`: Contains CI workflow.
* **No application code**.

---

## Step 1: The Architect Phase (/techspec)

**Goal:** Transform a Functional Spec (Google Doc) into a Technical Spec (Google Doc).

1. **Command:**
   ```
   /techspec "Name of your functional specs doc" "Your desired technology stack and requirements"
   ```

2. **What Happens:**
    * The agent searches your Drive for the doc.
    * It reads the requirements.
    * It generates a **Technical Specification** including Data Models, API Routes, and Architecture based on your inputs.
    * **Output:** It creates a *new* Google Doc titled "Technical Specification - Application name" and gives you the link.

---

## Step 2: The Planning Phase (/plan)

**Goal:** Break the Technical Spec down into an atomic Implementation Plan.

1. **Command:**
   ```
   /plan "Name of your Tech spec doc"
   ```
   *(Use the exact name of the doc generated in Step 1)*

2. **What Happens:**
    * The agent reads the Tech Spec.
    * It creates a local file `IMPLEMENTATION_PLAN.md`.
    * It breaks the project into phases (e.g., Setup, Backend, Frontend, Polish).
    * It defines the Git strategy.

---

## Step 3: The Build Phase (/build)

**Goal:** Execute the plan and write the code.

1. **Command:**
   ```
   /build IMPLEMENTATION_PLAN.md "Name of your Tech spec doc"
   ```

2. **What Happens (Iterative):**
    * **Execution:** The agent iterates through the plan, initializing the project structure and writing the application code.
    * **Visuals:** It generates necessary visual assets (images, icons) as defined in the spec.
    * **Progress:** It updates `IMPLEMENTATION_PLAN.md` as tasks are completed.

---

## Step 4: Final Delivery

**Goal:** Push the code and open a Pull Request.

1. **Action:**
   The `/build` command's final phase usually covers this, or you can manually instruct the agent to finalize the project.

2. **What Happens:**
    * The agent runs final checks (linting/formatting).
    * It creates a `README.md` for the new application.
    * It commits all changes.
    * It pushes the feature branch to GitHub.
    * It uses the GitHub extension to **Open a Pull Request**.

---

## Summary of Commands

| Step | Command | Input | Output |
| :--- | :--- | :--- | :--- |
| **1. Spec** | `/techspec` | Functional Doc (Drive) | Tech Spec (Drive) |
| **2. Plan** | `/plan` | Tech Spec (Drive) | `IMPLEMENTATION_PLAN.md` |
| **3. Build** | `/build` | Plan + Tech Spec | Code, Assets, App |