---
title: "Security and $PATH"
publishDate: "27 January 2023"
description: "Explaining why you should not add everything on your $PATH" 
tags: ["linux", "security", "path", "environment", "variables"]
draft: false
---

I was recently looking into whether flatpak should not add the directory of packages/applications downloaded in it to `$PATH`, since I needed this to be able to load my applications in an easier and more practical way. I got into a problem situation and decided to do some research on the subject.

## Why not add everything to $PATH?

Suppose I have a version of an application that does whatever you need, creating executable symlinks or wrapper scripts in `~/.local/share/flatpak/exports/bin` which I can add to my $PATH
I install a seemingly innocent app called com.shopping.ShoppingBuy, and I expect it to create `~/.local/share/flatpak/exports/bin/shopping-buy` or something
unknown to me. But it's not a benign app, and it is malicious or has been compromised, and it creates `~/.local/share/flatpak/exports/bin/pass` instead
Next time I try to use pass(1) to store a password, the malicious or compromised ShoppingBuy app receives that password (because it's first in my $PATH) and sends it to the attacker





