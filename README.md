# PCOWHILL GitHub Page


## REMINDER!
Anything on this page is available to the entire internet.  Do no post any
information that you would not post on Facebook, LinkedIn, etc.


## Using HTTP Locally
In order for some Javascript capabilities to behave as expected when opening
.html files within a browser locally, HTTP needs to be used.  To set up an
HTTP stream, enter the top-level directory of your clone for this repository
and run:


`python -m http.server`


Then, open a browser, and connect at the following link:


http://localhost:8000/


If this does not work, try instead using the IPv4 address that is returned
when running `ipconfig` within the command-prompt.  Also, confirm the port
used (8000 in this example) is the same port that Python returns after running
`python -m http.server`.


## Emulating Mobile Devices
Sometimes webpages can look different on mobile and desktop browsers.  If any
page on this website should be mobile-accessible, this can be checked within
MS Edge by pressing F12, opening the Developer Tools, and clicking on the
"Toggle device emulation" button that is at the top left of the DevTools or
instead by pressing Ctrl + Shift + M while DevTools is open.