# Google Summer of Code 2024

<p align="center"><i>A full report on my Google Summer of Code 2024 work with AOSSIE</i></p>
<p align="center"><i>Project: "Social Street Smart" </i>  👨‍💻</p>

<p align="center">
  <img src="https://i.imgur.com/fF5RFGo.png" />
</p>

### GSoC 2024 Report: Social Street Smart

#### Summary

This year's GSoC tasks focused on consolidating the project, improving its infrastructure, enhancing both backend and frontend components, and Dockerizing the application for streamlined deployment. Here's a quick summary of the work done:

- 🔄 **Project Migration and Consolidation**
- 🧠 **Machine Learning Model Updates**
- 🖥️ **Backend Improvements**
- 🎨 **Frontend Development**
- 📁 **Project Structure and Documentation Enhancements**
- 🐳 **Dockerization and Deployment**
- 🚀 **Ongoing Improvements**
- 🔄️ **Continuous Integration (Github Actions)**
- 🪽 **Frontend integration for News Origin and FakeNews**

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

- 🛠️ Upgraded versions and resolved dependency errors in all backend servers - Click bait, Hate Speech, FakeNews, ImageAPI, ReportAPI, NewsOrigin, Summariser
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

#### Dockerization and Deployment

- 🐳 Dockerized all critical APIs and services, including:
  - Fake News API
  - Image API
  - News Scraper
  - News Predictor
  - News Origin
- 🔐 Implemented SSL and security headers across all services
- ⚙️ Added `Dockerfile` and `docker-compose.yml` for easy local deployment
- 🌐 Integrated Terraform scripts for DynamoDB and automated deployment processes
- 🚀 Tested and deployed all endpoints, ensuring they are production-ready
- 🛠️ Streamlined deployment processes, reducing downtime and improving maintainability

#### CI/CD
- Made Github Workflow CI for all servers

#### Frontend integration for News Origin and FakeNews
- Added scripts for FakeNews and News Origin in eventPage
- Upgraded outdated code for manifest version 3 for fakenews, ImageAPI and NewsOrigin

#### Ongoing Work

- 📝 Preparing to publish the extension on various platforms
- 🔧 Addressing existing issues in the codebase

### Commits and Pull Requests

Here are some significant commits and pull requests made during the GSoC period:

- **Aug 25, 2024:**
- 
  - 📄 *Added final Docker Compose and bug fixes to run all servers using one command* ([#39](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/39)) - `vishavsingla`

  - 📄 *Added frontend code in scripts to effectively run fake news, imageAPI and NewsOrigin* ([#39](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/39)) - `vishavsingla`

- **Aug 24, 2024:**
  - 📄 *Added frontend code for newer dashboard* ([#38](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/38)) - `vishavsingla`

- **Aug 22, 2024:**
  - 📄 *Sqlite database added for fakenews* ([#36](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/36)) - `vishavsingla`

- **Aug 19, 2024:**
  - 📄 *Added documentation with links to datasets and APIs related to servers and models* ([#28](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/28)) - `vishavsingla`
  - 📄 *Added Github Workflows(CI) for Github based on Dockerfile* ([#29](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/28)) - `vishavsingla`

- **Aug 18, 2024:**
  - 📄 *Added updated README files for contributors and project* ([#26](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/26)) - `vishavsingla`
  - 📦 *Updated `requirements.txt` for Fake News API* ([#25](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/25)) - `vishavsingla`

- **Aug 17, 2024:**
  - 🐳 *Added Docker files for FakeNews API, ImageAPI, NewsOrigin, and FakeNews - Predictor and Scraper* ([#24](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/24)) - `vishavsingla`
  - ⚙️ *Fixed Fake News API server, restructured folders, and ensured all endpoints are functional* ([#20](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/20)) - `vishavsingla`

- **Aug 16, 2024:**
  - 🔧 *Fixed Fake News issues, added Terraform for DynamoDB, and ensured prediction endpoints are functional* ([#23](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/23)) - `vishavsingla`
  - ⚙️ *Fixed News Origin API, ensuring all endpoints are functional* ([#22](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/22)) - `vishavsingla`
  - 🖼️ *Added GoogleAPI integration to ImageAPI, tested all endpoints, and prepared for deployment* ([#21](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/21)) - `vishavsingla`


- **Aug 10, 2024:**
  - 🔧 *Started with GSoC'2024 Documentation* ([#23](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/23)) - `vishavsingla`

- **Jun 22, 2024:**

  - 🖼️ *Image API*: Updated `app.py`, `node.js`, and deployment files to run all routes in Image API Flask server ([#15](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/15)) - `vishavsingla`

  - 📦 *Clickbait API*: Updated and upgraded old packages and code, ensuring it is fully functional ([#14](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/14)) - `vishavsingla`

  - 🛠️ *News Origin API*: Restructured file system, upgraded libraries, and fixed errors to make the API functional ([#13](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/13)) - `vishavsingla`

  - 🧠 *Clickbait ML Models*: Updated and upgraded ML models, added documentation for setup ([#12](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/12)) - `vishavsingla`

  - 🧠 *Hate Speech ML Models*: Updated and upgraded to the latest versions ([#10](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/10)) - `vishavsingla`


- **Jun 17, 2024:**
  - 🔄 *Migrate project to GitHub and merge Client and Server repositories* ([#9](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/9)) - `vishavsingla`

### Future Scope

- 🌐 Expansion of supported social media platforms for broader applicability
- 📊 Enhanced user activity tracking and analysis features, including site blocking capabilities
- 🤖 Integration of AI-driven content moderation tools for automated filtering
- 🔄 Continuous improvement of ML models for higher accuracy and efficiency

### Project Links

- [Project Repository](https://github.com/AOSSIE-Org/Social-Street-Smart)
- [Download the Extension](https://chromewebstore.google.com/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en&pli=1)

### Acknowledgements

I would like to thank my mentors and the AOSSIE organization for their support and guidance throughout this GSoC period.
