------------------------------------
About
------------------------------------
We all know how long it takes to download lyrics. The internet may have an infinite collection of song lyrics, but there are just a few songs that we sing regularly. We want you to be able to get to these lyrics quickly, specially when you are on stage or just jamming with friends.

Quick Lyrix is a web based app which is designed to quickly provide lyrics for your favourite songs. It reads lyrics from text files saved offline and displays them even when you do not have an internet connection. Well, Say you do have an internet connection, finding lyrics using this app will still be a lot faster than any other website. We want you to spend more time singing and enjoying music, rather than waiting while the lyrics page gets loaded.

Quick Lyrix also acts as an index of the most popular songs. Don't waste time thinking of what to sing next. Just navigate to the index page and you have the entire set of songs sorted alphabetically. Can't recollect the song name? Try searching for the artist. Quick Lyrix will show you a list of songs by that artist.

------------------------------------
Why use Quick Lyrics?
------------------------------------
- Faster way to get to your lyrics. This app is built for speed. It stores lyrics offline and has a powerful search feature. You can also maintain a list of popular/well known songs so that everyone can join in.

- Can't recollect which song to perform next? Quick Lyrix provides you with an index of your favourite songs.

- The same app works on you phone, tablet as well as your desktop. You just need to copy the Quick Lyrix folder to your device.

- The readable font size depends on how far you are from the screen. Quick Lyrix helps you to easily resize the font. Once set, it will use the same font size throughout the session.

- Easy to use and navigate.

- Very easy to add new songs and expand your song collection.

------------------------------------
How do I run Quick Lyrix?
------------------------------------
If you are on a desktop or laptop, you will need to open the 'Start.html' file in Mozilla's Firefox browser. That's it, you are all set for an evening of singing your favourite songs. Unfortunately other browsers like Chrome and Internet Explorer will not work since they don't allow reading text files :(. To use other browser, you will need to host this app on a webserver (like IIS) installed on your desktop.

If you are on an Android Phone/Tablet, here is what you need to do.

1. Install iJetty from https://play.google.com/store/apps/details?id=org.mortbay.ijetty&hl=en

2. Copy the Quick Lyrix folder to jetty/webapps on your Android device.

3. Start the iJetty server.

4. Open your favourite Android browser.

5. Navigate to 127.0.0.1:8080

6. You will see a list of installed apps. Click on the URL pointing to Quick Lyrix.

7. Then click 'Start.html'

8. The app will start. We recommend that you add the app to your home screen by clicking 'Add to Home screen' in your browser's menu. The next time you want to launch the app, you just have to start the iJetty server and then open Quick Lyrix by clicking the icon on your homepage. An alternate way is to create a bookmark in your browser and  use it to launch Quick Lyrix after starting iJetty.

------------------------------------
How do I add more songs?
------------------------------------
Adding songs to Quick Lyrix is simple. All you need to do is:

1. Search for the lyrics of a song on the internet. 

2. Then copy and paste the lyrics into a text file. 

3. Provide a file name (eg: My Song.txt) and save the text file into the 'songs' folder of the app.

4. Now you need to make an entry in the 'songlist.txt' file. Open the 'songlist.txt' and append the above file name without the .txt part at the end it. You can add the artist name by separating the song name and the artist name with a hyphen. eg "My Song - My Artist"

5. If you want to add this song to the 'Popular' tab, append a '*' at the end of the song name. eg "My Song * - My Artist"

6. If you have multiple songs in the same text file, as in the case of medleys, each song title should be provided as shown below... 
    *** "My Song Title" ***
Quick Lyrix looks out for the combination * " and treats these lines as song titles.

------------------------------------
Keyboard shortcuts
------------------------------------
1. Navigate to song list (home) - Home, Escape, Backspace Keys
2. Zoom in - Plus Key
3. Zoom out - Minus Key
4. Clear session storage - End key (Used to refresh the list of songs. Afer adding a new song, press end and refresh the webpage)

Tip: To use the app directly on mozilla browser, type about:config in the address bar and search for security.fileuri.strict_origin_policy on the screen that opens up. Set this to false by double clicking. You can then directly open the Start.html file in the browse.

------------------------------------
Contact
------------------------------------
If you find any issues, have ideas for improvements, or if you want to provide feedback email me at samson.pinto@gmail.com

Have fun using Quick Lyrix. We hope that your jam session is a lot more enjoyable :)