TaskTracker - a Google Chrome plugin
====================================

A small utility to track time spent on your tasks


Change Log (first push 01/03/2013)
==================================

1. App running with MVC architecture.
2. Controler creates an instance of View. View creates an instance of Model.
2. Model sets and gets data (as stingifyiedarray) from localStorage. 
3. Model listens to the custom events triggered by controler, ergo observes when to add, edit & remove tasks.
3. View listens to the custom events triggered by model, ergo observes when a task is added, edited & removed.
4. Controller listens to user actions and triggers appropriate custom events.
