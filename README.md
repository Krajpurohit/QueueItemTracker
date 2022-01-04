<h1 align="center">Queue Item Tracker</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/Krajpurohit/QueueItemTracker?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/Krajpurohit/QueueItemTracker?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Krajpurohit/QueueItemTracker?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/Krajpurohit/QueueItemTracker?color=56BEB8">

  <!-- <img alt="Github issues" src="https://img.shields.io/github/issues/Krajpurohit/QueueItemTracker?color=56BEB8" /> -->

  <!-- <img alt="Github forks" src="https://img.shields.io/github/forks/Krajpurohit/QueueItemTracker?color=56BEB8" /> -->

  <!-- <img alt="Github stars" src="https://img.shields.io/github/stars/Krajpurohit/QueueItemTracker?color=56BEB8" /> -->
</p>

<!-- Status -->

<!-- <h4 align="center"> 
	🚧  Pcf Project 🚀 Under construction...  🚧
</h4> 

<hr> -->

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/Krajpurohit" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

Queue item tracker PCF control can be used to track case status and queue item histories i.e.(Which team case was routed and who has worked on it)

## :sparkles: Features ##

:heavy_check_mark: Case Status changes;\
:heavy_check_mark: Queue Item histories (Pick, Remove, Add);\
:heavy_check_mark: Filter flow to hide case or queue item records;

## :rocket: Technologies ##

The following tools were used in this project:

- [React](https://pt-br.reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have meet following pre-requisites.

:heavy_check_mark: Audit should be enabled at system level and for Case and Queue Item tables;\
:heavy_check_mark: Post rule with rule id "AddToQueue.Rule" should be active;\
:heavy_check_mark: Logged in user should have access to Read "Posts" and "prvReadAuditSummary";\


## :checkered_flag: Starting ##

* Create a new tab on Case form and add a Dummy Field
  <img alt="Create New Tab" src="https://raw.githubusercontent.com/Krajpurohit/QueueItemTracker/master/Demo/images/Case%20Form%20New%20Tab.PNG">
* Associate Queue Item Tracker control against Dummy Field
  <img alt="Associate Control" src="https://raw.githubusercontent.com/Krajpurohit/QueueItemTracker/master/Demo/images/Associate%20Control.PNG">
* After creating new case, try genering flow.
  <img alt="Associate Control" src="https://raw.githubusercontent.com/Krajpurohit/QueueItemTracker/master/Demo/images/Generate%20Flow.PNG">

## :disappointed: Limitations

* Can only be applied on Cases as "Auto Post" only generates when a case gets added to a Queue.



## :memo: License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE.md) file.


Made with :heart: by <a href="https://github.com/Krajpurohit" target="_blank">Ketan Rajpurohit</a>

&#xa0;

<a href="#top">Back to top</a>
