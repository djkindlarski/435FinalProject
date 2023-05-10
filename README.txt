This is the final project for CS 403, written by Joe Vossel and David Kindlarski (myself).

It is a a drag and drop implementation of the JavaScript coding language, written in JavaScript, CSS, and HTML, and implementing WebGL.

IMPORTANT: THIS PROGRAM IMPLEMENTS TEXTURES IN WEBGL, WHICH REQUIRES A SECURE SERVER TO RUN FROM. THIS CAN BE DONE USING A PYTHON TERMINAL RUNNING THESE COMMANDS:
    WINDOWS: py -m http.server 
    MACOS: python3 -m http.server
    AND THEN OPENING http://localhost:8000 IN A BROSWER OF YOUR CHOICE AND FOLLOWING THE FILE SYSTEM TO WHERE THE CODE IS SAVED. THIS PROGRAM WILL NOT WORK OTHERWISE.

The test cases can be seen in the "Test Case Photos" folder, with screenshots showing code and output for every single aspect.

There is also a video titled "Demonstration", which is Joe and I showing how the program works, what a user is able to do, and how to create and run a program.
Alternatively, here is a written explanation of how to use this program:
    1) Each block has a title which matches to its job. The var block creates a variable, the for block creates a for loop, etc.
    2) To use a block, click and drag it right into the workspace. If it has a white box, you can perform shift+click to edit the data.
    3) When editing the data, a text box will appear at the top of the screen, as well as a label that says "Data:". This will be empty until data is given to the object.
    4) The goal of this language is to simplify coding. Hence, each block requires a bit less typing. For example:
        a) the var, boolean, double, and const block would only need "varName" or "varName = varVal"
        b) if blocks and if else blocks would only need "varName == comparedVal"
        c) a function block would only need "testFunction()"
        d) a this block requires only "varName"
        e) a do block can take any JavaScript statment, such as "varAnswer = testFunction()"
        f) a for block would take "var1 = 0; var1 < 10; var1++"
        g) a while block would take "var1 == 0" or "var1"
        h) a print block requires "varName" or " "insert text here" "
        i) a return block would need "varName" or a value
    5) Any function that would traditionally require a closed bracked now has a separate block to end the operation. That includes all loops, all if/else statements, and functions.
    6) When you are done building the blocks, you can click the "Code" button to display the actual JavaScript you have created. An experiened eye might notice bugs here they missed in their blocks.
    7) Pressing the "Run" button runs your code, with any printed statements popping up at the top of your screen. Print statements will execute one at a time.
    8) If there are errors in your code, the program will do its best to print them to the top of the screen.
    9) To delete any singular block, simply do control+click.
    10) To delete a full function, drag and drop it in the garbage can at the bottom right corner.
    11) To reset, simply delete all code blocks or just refresh the page. There is no way to save code at this time.

We created this project with the intention of creating a fun and interactive programming alternative to the traditional text format.
Hopefully, it could be used as a teaching tool for young programmers or even just people first getting into coding.
JavaScript was some of the first coding either of us have ever done, so it was important to us to make it accessable to people who are not good at typing/formatting yet.

Similar to how code is run in a normal compiler, this program follows the JavaScript grammar (labeled "JavaScriptSyntaxTree" in the Code file).
Meaning as we are NOT interpreting anything in this project, merely extending a language to make it slightly easier to learn, 
we do not have to deal with making our own syntax trees. We only have to extend the JS one, and use it as we would normally do. 
That being said, we do still have to parse the input for all of the data values. So while we are not creating our own grammer, we strictly follow JavaScript's.

This project does a great job for what it is, but given more time there are certain things that we would love to improve.
First, the runtime of many operations could definitely be improved, leading to faster block loading and data updates.
Second, the display of data and outputs is very minimal. A dedicated output box with stylized results would be much nicer.
Third, the print statements would be combined so that they print together, and not one at a time.
Finally, a tutorial on how to use the program would be very beneficial for any user trying to learn with the product.

Overall, we are very proud of this project and everything it accomplishes. To be honest, this is much more than I would have expected from myself at the start of the semester.
This has been a fun and cool opportunity to create something new and call it our own, and we hope you enjoy it as much as we do.

Thank you for your time,
Joe Vossel, David Kindlarski
CS 403 Programming Languages