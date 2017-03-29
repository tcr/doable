#!/bin/sh

git push origin `git subtree split --prefix build master`:gh-pages --force
