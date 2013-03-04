TaskTracker - a Google Chrome plugin
====================================

A small utility to track time spent on your tasks


How to use it as Google Chrome plugin
=====================================

1. Download the project files as zip or pull it. Unzip and save it to your desired folder.
2. Open Google Chrome and click on the options icon on the far right side of the address bar.
2. Goto Tools > Extensions.
3. Click on the Developer mode checkbox opposite to the heading "Extensions"
4. You will find a new button "Load unpacked extension" right beneth the heading. 
5. Click it and navigate to the folder where you saved the files.
6. Hit ok and the plugin is ready to use. You can find a new Task Tracker icon besides the options icon.
7. Click the Task Tracker icon to use it.


Change Log (first push 01/03/2013)
==================================

1. App running with MVC architecture.
2. Controller creates an instance of View. View creates an instance of Model.
2. Model sets and gets data (as stingifyied array) to & from localStorage.
3. Model listens to the custom events triggered by Controller, ergo observes when to add, edit & remove tasks (data).
3. View listens to the custom events triggered by Model, ergo observes when a task is added, edited & removed from Model.
4. Controller listens to user actions and triggers appropriate custom events.
