---
title: How to update all python packages
publishDate: 7 June 2024
description: Simplifying how to easily manage dependency upgrades on Python projects.
tags:
  - python
  - upgrade
draft: true
---
## Packages

With Python, the best practice of pinning all the packages in an environment at a specific version ensures that the environment can be reproduced months or even years later. 

- Pinned packages in a requirements.txt file are denoted by == . 
	- For example, requests == 2.21.0. 
	- Pinned packages should never be updated except for a very good reason, such as to fix a critical bug or vulnerability.
- Unpinned packages are typically denoted by >=, which indicates that the package can be replaced by a later version. 
	- They are more common in development environments, where the latest version can offer bug fixes, security patches and even new functionality.

As packages age, many of them are likely to have vulnerabilities and bugs logged against them. In order to maintain the security and performance of your application, you’ll need to update these packages to a newer version that fixes the issue. 

---
### PIP

The [pip package manager](https://www.activestate.com/resources/quick-reads/how-to-install-pip-on-windows/) can be used to update one or more packages system-wide. However, if your deployment is located in a virtual environment, you should use the Pipenv package manager to update all Python packages.
#### System-wide

In general, you can use the following steps to perform a package upgrade:

1. Check that Python is installed
2. Get a list of all the outdated packages

```shell
pip list --outdated
```

3. Upgrade outdated packages
	1. Windows
	```sh
pip freeze | %{$_.split('==')[0]} | %{pip install --upgrade $_}
```
	
	2. Linux
```sh
pip3 list -o | cut -f1 -d' ' | tr " " "\n" | awk '{if(NR>=3)print}' | cut -d' ' -f1 | xargs -n1 pip3 install -U
```
#### By requirements

```sh
pip freeze > requirements.txt
pip install -r requirements.txt --upgrade
```

---
### Pipenv

Pipenv automatically creates and manages a virtual environment for projects. It ensures that each project has its own dependencies isolated from others, preventing conflicts between packages used in different projects.

Pipenv integrates the functionalities of `pip` and `virtualenv` (tool for creating isolated Python environments), providing a single tool to manage both.


1. Activate the environment to be upgraded:
```sh
pipenv shell
```

2. Upgrading all the packages from Pipfile:
```sh
pipenv update
```

