# Google Summer of Code 2024

<p align="center"><i>A full report on my Google Summer of Code 2024 work with AOSSIE</i></p>
<p align="center"><i>Project: "Social Street Smart" </i>  👨‍💻</p>

<p align="center">
  <img src="https://i.imgur.com/fF5RFGo.png" />
</p>

### GSoC 2024 Report: Social Street Smart

#### Summary

This year's GSoC tasks focused on consolidating the project, improving its infrastructure, and enhancing both backend and frontend components. Here's a quick summary of the work done:

- 🔄 **Project Migration and Consolidation**
- 🧠 **Machine Learning Model Updates**
- 🖥️ **Backend Improvements**
- 🎨 **Frontend Development**
- 📁 **Project Structure and Documentation Enhancements**
- 🚀 **Ongoing Improvements**

#### Project Migration and Consolidation

- 🔄 Migrated the entire project from GitLab to a new platform
- 🔗 Merged two repositories (`social-street-smart` and `social-street-smart-api`) into one cohesive structure
- 🗃️ Consolidated commit histories for a more organized project structure

#### Machine Learning Model Updates

- 🧠 Set up and updated existing ML models for:
  - Clickbait detection
  - Hate speech detection
  - Fake news detection
- 📦 Upgraded packages to newer versions
- 🧑‍💻 Added code to generate new trained deep learning (TensorFlow) files
- ☁️ Prepared models for hosting on AWS Lambda

#### Backend Improvements

- 🛠️ Upgraded versions and resolved errors in all backend servers
- ⚙️ Ensured all servers, models, and APIs are functioning without issues
- 🚀 Improved overall backend stability and performance

#### Frontend Development

- 🎨 Migrated the frontend to:
  - React
  - TypeScript
  - shadcn/ui
- ⏱️ Developed a new feature to track user web activity (time spent on websites)
- 🔄 Working on integrating the new web activity feature into the updated extension

#### Project Structure and Documentation

- 📁 Restructured the entire file system for improved readability
- 📚 Added comprehensive documentation in the README for running models
- 🗂️ Created dedicated input and output folders for ML models to enhance understanding

#### Ongoing Work

- 📝 Preparing to publish the extension on various platforms
- 🔧 Addressing existing issues in the codebase due to changes in social media sites

### Commits and Pull Requests

Here are some significant commits and pull requests made during the GSoC period:

- **Commits on Aug 10, 2024:**
  - 🛠️ *Resolved errors for hate speech Flask server* - `vishavsingla`
  - 📦 *Added updated requirements.txt file for environment* - `vishavsingla`

- **Commits on Jun 22, 2024:**
  - 🖼️ *Image API*: Updated `app.py`, `node.js`, and deployment files to run all routes in Image API Flask server ([#15](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/15)) - `vishavsingla`
  - 📦 *Clickbait API*: Updated and upgraded old packages and code, ensuring it is fully functional ([#14](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/14)) - `vishavsingla`
  - 🛠️ *News Origin API*: Restructured file system, upgraded libraries, and fixed errors to make the API functional ([#13](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/13)) - `vishavsingla`
  - 🧠 *Clickbait ML Models*: Updated and upgraded ML models, added documentation for setup ([#12](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/12)) - `vishavsingla`
  - 🧠 *Hate Speech ML Models*: Updated and upgraded to the latest versions ([#10](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/10)) - `vishavsingla`

- **Commits on Jun 17, 2024:**
  - 🔄 *Migrate project to GitHub and merge Client and Server repositories* ([#9](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/9)) - `vishavsingla`

### Future Scope

- 🌐 Expansion of supported social media platforms
- 📊 Enhanced user activity tracking and analysis features, including site blocking capabilities

### Project Links

- [Project Repository](https://github.com/AOSSIE-Org/Social-Street-Smart)
- [Download the Extension](https://chromewebstore.google.com/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en&pli=1)

### Acknowledgements

I would like to thank my mentors and the AOSSIE organization for their support and guidance throughout this GSoC period.

