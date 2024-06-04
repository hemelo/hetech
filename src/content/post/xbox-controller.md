---
title: "How to setup XBOX Controller on Arch Linux for gaming"
description: "This post is for teaching how to setup XBOX Series S/X controller on Arch and how to do troubleshooting." 
publishDate: "04 May 2024"
tags: ["arch", "linux", "gaming"]
draft: false
---

I spent a bit of time trying to install and configure this but in the end it worked. I'm going to share what I did to help anyone who is experiencing the same problem or who wants to configure the control the same way I configured it.

## Prerequisites

Make sure you have the following packages installed: dkms, linux-headers, git, and a bluetooth implementation. I'll be using bluez.

```bash
sudo pacman -S dkms linux-headers bluez bluez-utils
```

## xpadneo

I decided to use the [xpadneo driver](https://atar-axis.github.io/xpadneo/) since it has more features and is more up-to-date than the default driver. It is a advanced driver for the XBOX controller. To install it, clone the repository and run the install script.

```bash
git clone https://github.com/atar-axis/xpadneo.git
cd xpadneo
sudo ./install.sh
```

## Testing

After installing the driver, connect the controller to the computer via bluetooth. To do this, you must activate the bluetooth service:

```bash
sudo systemctl start bluetooth
sudo systemctl enable bluetooth # to start the service at boot
```

Then, press the sync button on the controller and run the following command:

```bash
sudo bluetoothctl
```

This will open the bluetooth control panel. Run the following command to find the controller:

```bash
scan on
```

You may notice the controller's MAC address. Copy it and run the following command:

```bash
scan off
pair <MAC_ADDRESS>
trust <MAC_ADDRESS>
connect <MAC_ADDRESS>
```

After that, you can see if it's working on cli by looking on the output of connect info. If it's connected it will print "Connected: yes".

## Troubleshooting

I had a lot of problems with the controller not working properly. If you have the same problem, try pressing the sync button again and repeating the process above after unpair controller.
You can unpair with the following command:

```bash
remove <MAC_ADDRESS>
```

If you still have problems, try following the [instructions](https://atar-axis.github.io/xpadneo/#troubleshooting) on the xpadneo repository. They have a lot of information on how to solve problems with the controller.