# 🎬 VideoTube — Backend API

A production-style backend **for** a video-sharing and microblogging platform, inspired by YouTube and Twitter. It supports user authentication, video uploads, playlists, likes, comments, tweets, subscriptions, watch history, and a creator dashboard.

Built with **Node.js, Express, MongoDB (Mongoose)** and **Cloudinary** for media storage.

---

## ✨ Features

### 👤 Users & Authentication
- Register with avatar and cover image upload
- Login and logout with **JWT access + refresh tokens**
- Refresh the access token without logging in again
- Change password, update account details, avatar and cover image
- Channel profile with subscriber and subscription counts
- Watch history

### 🎥 Videos
- Upload a video and thumbnail (stored on Cloudinary)
- List videos with **search, sorting and pagination**
- Get a video by id (view count increases automatically)
- Update title, description and thumbnail (old thumbnail is removed from Cloudinary)
- Delete a video (video file and thumbnail are removed from Cloudinary)
- Publish / unpublish toggle — unpublished videos are only visible to their owner

### 💬 Comments
- Add, update and delete comments on a video
- Paginated comments with owner details

### 🐦 Tweets
- Create, update and delete tweets
- Get all tweets of a user

### ❤️ Likes
- Toggle like on videos, comments and tweets
- Get all videos liked by the logged-in user

### 📺 Subscriptions
- Subscribe / unsubscribe to a channel (self-subscription is blocked)
- List a channel's subscribers
- List the channels a user has subscribed to

### 📂 Playlists
- Create, update and delete playlists
- Add and remove videos
- Get a user's playlists and a playlist by id

### 📊 Creator Dashboard
- Channel stats: total videos, total views, total subscribers, total likes
- All videos uploaded by the logged-in channel

### 🩺 Health Check
- Simple endpoint to confirm the server is running

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens (access + refresh), bcrypt |
| File uploads | Multer (temporary storage) → Cloudinary |
| Pagination | mongoose-aggregate-paginate-v2 |
| Other | cookie-parser, cors, dotenv |

---

## 📁 Project Structure

```
.
├── package.json
├── Readme.md
├── public
│   └── temp                  # temporary storage for uploaded files
└── src
    ├── app.js                # Express app, middleware, route mounting
    ├── constants.js
    ├── index.js              # entry point: DB connection + server start
    ├── controllers
    │   ├── comment.controller.js
    │   ├── dashboard.controller.js
    │   ├── healthcheck.controller.js
    │   ├── like.controller.js
    │   ├── playlist.controller.js
    │   ├── subscription.controller.js
    │   ├── tweet.controller.js
    │   ├── user.controller.js
    │   └── video.controller.js
    ├── db
    │   └── index.js          # MongoDB connection
    ├── middlewares
    │   ├── auth.middleware.js     # verifyJWT
    │   └── multer.middleware.js   # file upload handling
    ├── models
    │   ├── comment.model.js
    │   ├── like.model.js
    │   ├── playlist.model.js
    │   ├── subscription.model.js
    │   ├── tweet.model.js
    │   ├── user.model.js
    │   └── video.model.js
    ├── routes
    │   └── *.routes.js       # one router per resource
    └── utils
        ├── ApiError.js       # consistent error class
        ├── ApiResponse.js    # consistent response format
        ├── asyncHandler.js   # removes try/catch boilerplate
        └── cloudinary.js     # upload and delete helpers
```
---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account

### Installation

```bash
git clone https://github.com/mrakeshh/videotube
cd videotube
npm install
```

### Environment variables

Create a `.env` file in the project root following the `.env.sample` file's structure


### Run the server

```bash
npm run dev
```

The API will be available at `http://localhost:8000/api/v1`.

---

## 📡 API Overview

All routes are prefixed with `/api/v1`. Routes marked 🔒 require a valid access token (cookie or `Authorization: Bearer <token>`).

### Health check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/healthcheck` | Server status |

### Users
| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register (avatar + cover image) |
| POST | `/users/login` | Login |
| POST | `/users/logout` 🔒 | Logout |
| POST | `/users/refresh-token` 🔒 | Get a new access token |
| POST | `/users/change-password` 🔒 | Change password |
| GET | `/users/current-user` 🔒 | Current user |
| PATCH | `/users/update-account` 🔒 | Update name / email |
| PATCH | `/users/avatar` 🔒 | Update avatar |
| PATCH | `/users/cover-image` 🔒 | Update cover image |
| GET | `/users/c/:username` 🔒 | Channel profile |
| GET | `/users/history` 🔒 | Watch history |

### Videos
| Method | Endpoint | Description |
|---|---|---|
| GET | `/videos` | List videos (`page`, `limit`, `query`, `sortBy`, `sortType`, `userId`) |
| POST | `/videos` 🔒 | Upload video + thumbnail |
| GET | `/videos/:videoId` | Get a video |
| PATCH | `/videos/:videoId` 🔒 | Update details / thumbnail |
| DELETE | `/videos/:videoId` 🔒 | Delete a video |
| PATCH | `/videos/toggle/publish/:videoId` 🔒 | Publish / unpublish |

### Comments, Tweets, Likes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/comments/:videoId` | Comments of a video (paginated) |
| POST | `/comments/:videoId` 🔒 | Add a comment |
| PATCH / DELETE | `/comments/c/:commentId` 🔒 | Update / delete a comment |
| POST | `/tweets` 🔒 | Create a tweet |
| GET | `/tweets/user/:userId` | Tweets of a user |
| PATCH / DELETE | `/tweets/:tweetId` 🔒 | Update / delete a tweet |
| POST | `/likes/toggle/v/:videoId` 🔒 | Like / unlike a video |
| POST | `/likes/toggle/c/:commentId` 🔒 | Like / unlike a comment |
| POST | `/likes/toggle/t/:tweetId` 🔒 | Like / unlike a tweet |
| GET | `/likes/videos` 🔒 | Videos liked by the user |

### Subscriptions, Playlists, Dashboard
| Method | Endpoint | Description |
|---|---|---|
| POST | `/subscriptions/c/:channelId` 🔒 | Subscribe / unsubscribe |
| GET | `/subscriptions/c/:channelId` 🔒 | Channel subscribers |
| GET | `/subscriptions/u/:subscriberId` 🔒 | Channels a user subscribed to |
| POST | `/playlist` 🔒 | Create a playlist |
| GET | `/playlist/user/:userId` | Playlists of a user |
| GET / PATCH / DELETE | `/playlist/:playlistId` | Get / update / delete a playlist |
| PATCH | `/playlist/add/:videoId/:playlistId` 🔒 | Add a video |
| PATCH | `/playlist/remove/:videoId/:playlistId` 🔒 | Remove a video |
| GET | `/dashboard/stats` 🔒 | Channel statistics |
| GET | `/dashboard/videos` 🔒 | Videos uploaded by the channel |

> Endpoint paths may differ slightly depending on your route files. Adjust this table to match your project before publishing.

### Example response

```json
{
  "statusCode": 200,
  "data": {
    "videos": [ ... ],
    "totalVideos": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true
  },
  "message": "All videos fetched successfully",
  "success": true
}
```

---

## 🧪 Testing

Test the API with [Postman](https://www.postman.com/) or Thunder Client:
- Send file uploads as **form-data** (`videoFile`, `thumbnail`, `avatar`, `coverImage`).
- Send other data as JSON or form-data, depending on the route.
- For protected routes, log in first so the access token cookie is set, or add a `Bearer` token header.

---
🌐 **Live API:** [https://your-app.vercel.app/api/v1/healthcheck](https://your-app.vercel.app/api/v1/healthcheck)

## 🙌 Acknowledgements

This project was built as part of my backend learning journey, following the backend series by [Hitesh Choudhary](https://www.youtube.com/@chaiaurcode) (Chai aur Code) and extending it with my own improvements: ownership checks, safe search, visibility rules, aggregation-based statistics, and Cloudinary cleanup.

---

⭐ If you found this project useful, consider giving it a star!
