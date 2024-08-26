#### Summary

This year GSoC tasks focused on improving ad-blocking functionality, enhancing frontend UI, upgrading server components, and optimizing ML models for better performance and deployment. Below is a summary of the contributions made:

- 🔍 **Bloom Filter Integration**
- 🔄 **Project Migration and Consolidation**
- 🧠 **Machine Learning Model Updates**
- 🎨 **Frontend UI Revamp**
- ⚙️ **Backend Server Upgrades**
- 🤖 **ML Model Optimization (TFLite)**
- 🔐 **Security and Dockerization**
- 🔄 **Manifest Version Upgrade**
- 📝 **Documentation and Testing**
- 🚫 **Ad Blocking Integration**
- 🧩 **Social Media Detection and Blocking Enhancements**




#### Frontend UI Revamp

- 🎨 Completely revamped the frontend UI using:
  - Shadcn
  - TypeScript
  - React and Vite
- ⬆️ Improved user interface and user experience for better accessibility and functionality.
- ✨ Added classes and scripts to detect and handle hate speech and clickbait content on social media platforms like Twitter and Facebook.
- I migrated the existing frontend codebase to React,  This migration made the extension visually more appealing. The frontend now primarily consists of two entry points: `popup.js` and `settings.js`. `popup.js` is the component that activates when the extension is opened from the menu bar, while `settings.js` appears when accessing settings from `popup.js`. These entry points are clearly defined in `vite.js`. Existing scripts were incorporated by adding them to the public folder.
- I addressed compatibility issues where certain backend scripts were not functioning correctly with the frontend. Despite receiving responses from the server, issues persisted with services like SSL. I resolved these problems and fixed non-functional services such as the profanity word blurring feature. Additionally, I created a configuration file for specifying server links, which streamlined the development experience. The frontend is relatively new and needs more testing. previous scripts that are being used are not very efficient and leads to slower results and laggy browser experience 

#### Backend Server Upgrades

- ⚙️ Upgraded Flask servers and fixed bugs for:
  - Clickbait detection
  - Hate speech detection
- 🐳 Created Docker files for the servers, ensuring efficient and consistent deployment.
- 🔧 Fixed issues and tested SSL, security header, and summarizer services for optimal performance.

#### ML Model Optimization

- 🤖 researched about Implemented TensorFlow Lite (TFLite) for:
  - Clickbait detection
  - Hate speech detection
- 🔄 Updated and optimized ML models for better accuracy and performance, facilitating serverless deployment.

#### Security and Dockerization
Originally, the extension was planned to be deployed using a Lambda function. However, following discussions with my mentor, we decided to Dockerize the application. This change allows users to deploy the extension using GitHub Docker files. I managed the Dockerization of components including SSL, Security_Header, ClickBait, HateSpeech, ReportAPI, and Summarizer. I created individual Docker containers for each server and a main Docker container with Supervisor to manage all servers within a single container, significantly improving the development experience for future contributors.
- 🐳 Added comprehensive Docker support for various APIs and services.
- 🔐 Dockerized SSL and security header services to enhance security across all components.
- 🐳 Dockerized Hate Speech, Clickbait, and ReportsAPI.

#### Manifest Version Upgrade

- 🔄 Upgraded extension from Manifest Version 2 to Version 3 for improved functionality and compliance with modern standards.

#### Summarizer Integration

- 📝 Improved and tested ChatGPT-based summarizer for enhanced content summarization capabilities.

#### Bloom Filter Integration
I enhanced data storage and lookup operations by integrating a Bloom Filter. This Bloom Filter offered two options: using standard Python libraries or leveraging a pre-built service like Redis. I chose to utilize the `rbloom` library, which is built in Rust, providing both speed and reliability. For this, I used the URL HAUS dataset to create the Bloom Filter. I developed a `createBloomFilter.py` file within the Security_Header server, which generates the Bloom Filter object used by the server to determine if a link is malicious.
- 🔍 Implemented Bloom Filter to efficiently manage and query large datasets. This includes:
  - URL testing and blocking dangerous sites to improve user safety and application performance.
  - Optimized Bloom Filter to reduce false positive rates in content filtering and ad-blocking processes.
#### Ad Blocking Integration

- 🚫 Integrated uBlock ad blocker to enhance ad-blocking capabilities within the application.
- I initially integrated adblocker support into the extension while it was still using Manifest V2, demonstrating it during the mid-term evaluation. However, after transitioning to Manifest V3, incorporating an adblocker became impractical due to significant changes in the extension architecture. Manifest V3 imposes restrictions on certain APIs and background processing capabilities, making effective adblocking unfeasible. 

#### Social Media Detection and Blocking Enhancements

- 🧩 Added specialized classes and scripts in the frontend to:
  - Detect and handle hate speech and clickbait on platforms like Twitter and Facebook.
  - Ensure the extension can effectively block or flag harmful content as per user settings.
#### Migration of Frontend from manifest v2 to v3
- This was one of the task that took alot of time and energy. I updated the extension scripts to be compatible with Manifest V3. This required changes in how the `background.js` script operates, transitioning to use service workers. I also addressed issues with APIs like data fetching and context menus that were incompatible with the new manifest. Additionally, I adapted event listeners and updated Chrome storage functions to align with V3 requirements.
- This was essential for deployment of extension this year to webstore

#### Commits and Pull Requests

Here are some significant commits and pull requests made during the GSoC period:

  - New Frontend ([#31](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/31))
  - Bloom Filter support([30](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/30)) 
  -  ChatGPT integration in summarizer([#32](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/32))
  - *Dockerizing SSL and security headers* ([#27](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/27))

  - *Fixing Hate Speech server issues* ([#17](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/17))

  - *Dockerizing Clickbait and Hate Speech services* ([#19](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/19))
   
  - And many other frontend and backend migration and bug fixes and docker support ([#38](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/38), [#34](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/34),[ #33](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/33), [#16](https://github.com/AOSSIE-Org/Social-Street-Smart/pull/16))
  
### Future Scope

- 🌐 Expanding ad-blocking capabilities to additional services and platforms
- 🖥️ Further enhancements to the frontend UI for improved user experience
- 🔧 Ongoing optimization of ML models for increased accuracy and efficiency
- 🔄 Continuous improvements to security and Dockerization practices
- 🔍 Enhancing Bloom Filter performance and integration in additional features
- 🧩 Further integration and testing for social media platforms to ensure robust content filtering

### Project Links

- [Project Repository](https://github.com/AOSSIE-Org/Social-Street-Smart)
- [Download the Extension](https://chromewebstore.google.com/detail/social-street-smart/ddjcjpfkmcgpgpjhlmdenmionhbnpagm?hl=en&pli=1)
- [Demo video link](https://drive.google.com/file/d/1N-AS6fYFcRA741JNuWn_pTUWCnyNERh8/view?usp=drive_link)

### Acknowledgements

I would like to thank my mentors and the AOSSIE organization for their support and guidance throughout this GSoC period. 
