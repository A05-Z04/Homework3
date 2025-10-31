# CPSC 349 – Homework 3: React Movie Explorer

Helo! My name is **Adrian Zacapala**, and this is my submission for **Homework 3** in CPSC 349.  
For this project, I decided to rebuild my previous “Movie Explorer” website completely in **React**.  
I wanted it to look and function exactly like my Homework 2 version — just using React components, state, and props.

## Project

App connects to **The Movie Database (TMDB)** API to display a list of movies.  
Features Included:

- Displays 20 movies per page  
- Shows poster, title, release date, and average rating  
- Includes **Previous** and **Next** buttons for pagination  
- Has a **search bar** to find movies by title  
- Includes a **dropdown menu** to sort by release date or rating  



## API TMDB

I decided not to upload my TMDB API key to GitHub for security reasons.  
It’s stored locally in a hidden file called **`.env.local`**, which is ignored by Git.

If you’d like to test this project on your own computer, follow these steps:

1. Create a free account at [The Movie Database](https://www.themoviedb.org/).  
2. Request your own API key under your profile → **Settings → API**.  
3. In the project’s root folder, create a file named: .env.local
4. Add this line inside: REACT_APP_TMDB_KEY=YOUR_TMDB_API_KEY_HERE  
