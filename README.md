## The Hangman Game:

- When the game is started, the player is represented with an empty field for each letter in the word.

- When the player guesses a letter correctly, each field that represents that letter is filled with the letter.

- When the player guesses a letter incorrectly, a piece of a gallow with a hanging man is drawn.

- After 10 incorrect guesses, the game is over and the player lost. Thus, there should be 10 different states of the gallow to be drawn.

- If all fields are filled with their letter before 10 incorrect guesses, the player has won the game.

The technical requirements are as follows:

- Server/client based with the client being the browser

- Business logic executed on the server (so nobody can cheat)

- Allow for keeping simple statistics (games won/lost)

- Game is self-contained

- Game must scale to millions of users (discussion)

### How to Run locally

1. cd into current directory

2. run `npm install`

3. run `npm start`

4. go to `localhost:3000`, if your 3000 port is occupied by other services, change `var port = normalizePort(process.env.PORT || '3000');` in `bin/www` to a port number of your choice

5. start playing and accumulate your win/lose records.

### How to Run online

The whole application has been deployed to AWS, visit this link:

[http://ec2-54-191-60-58.us-west-2.compute.amazonaws.com:3000/](http://ec2-54-191-60-58.us-west-2.compute.amazonaws.com:3000/)

### Implementations:

1. Use (M)EAN stack as basic framework, no MangoDB is used here tho, AngularJS for front end interaction with users, nodeJS handles all the game logic(generate word of different difficult levels, determine whether a specific guess is correct or not, return correct answer)

2. Use browser's local storage to save user's # of wins and loses

3. Use a txt file containing 372,174 English words as library, use chunkBuffer to read the txt file(could be handy when the file size increase exponentially, e.g. hangman for pharses, proverb, etc.) difficulty of the word is determined by computing a score based on the lack of vowels in the word, the number of unique letters, and the commonness of each letter. The rule works great so far.

### Testing:

1. Use mocha and chai to test the core function of node part. `npm test`

2. Use karma and jasmine to test angular part. `karma start`

### Improvements

1. Could write some test cases for both angular and node, as well as error handling.

2. Maybe UI could be redesigned in a more aesthetically pleasing way.

3. For scaling, the best practice would be performing it on AWS, considering the following cases:

- **10 - 99 concurrent users:** upgrade to t2.medium or equivalent (2 CPU / 4 GB RAM), run two instances of NodeJS and load balance it with Nginx.

- **100 - 999 concurrent users:** upgrade to m4.xlarge or equivalent (4 CPU / 16 GB RAM), after that the database might be another bottleneck, considering if we're using database in this hangman game(maybe allowing user to register an account and save their records, etc.), then we can move the database to a different server and scale it independently. You might also want to play with /etc/security/limits.d and /etc/sysctl.conf based on your needs. For instance the maximum number of requests queued are determined by net.core.somaxconn, which defaults to 128. Change it to 1024 so we can meet the 100 - 999 range of users.

- **1,000+ concurrent users:** a few steps can be perfromed:

1. Add load balancer (e.g. ELB) and add app units.

2. Use multiple availability zones in a region (e.g. us-east-1, us-west-1)

3. Split static files to different server/service for easier maintenance. (e.g. AWS S3 and CloudFront CDN). Add CDN for static files for optimizing cross-origin performance and lower the latency. You can store assets such as Javascript, CSS, images, videos, and so on.

- **100,000+ concurrent users:** break it down into multiple smaller and independent components (microservices/SOA) that we can scale independently, use the load balancer to redirect the traffic to the new small service instead of the main app, you can also do autoscaling for a specfic period of time(e.g World hangman's Day)

