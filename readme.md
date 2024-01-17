# Github User Search
## Search any user, and display their public repositories 


To clone the repository, use the git clone command.
```
git clone https://github.com/anay-208/github-user-search.git
```


After cloning the repository, navigate to the project's directory:

```
cd project-directory
```

To add an authentication token in `index.js` to increase the rate limit, you'll need to first create a token on GitHub. Here are the steps:

1. Go to your GitHub settings.
2. Click on "Developer settings".
3. Click on "Personal access tokens".
4. Click on "Generate new token".
5. Give your token a descriptive name.
6. Copy the token.
7. Then, in your index.js file, you can use this token when making requests to the GitHub API.

This will increase your rate limit from 60 requests per hour to 5000 requests per hour.

Please note that you should not commit your token to the repository. It's better to use environment variables to store your token. If you accidentally commit your token, you should revoke it immediately.