# jiraf

Jira + git workflow helper with a really long neck.

# Setup

Requirement: [Deno](https://deno.land/).
```bash
brew install deno
```

Setup:
```bash
cd
git clone https://github.com/endreymarcell/jiraf
ln -s ~/jiraf/cli/jiraf.sh ~/bin  # just put it on your path somehow
```

Optionally, to set up branch-to-ticket auto-tracking in a given git repository:
```bash
cd /path/to/my/repo
cp ~/jiraf/git/post-checkout .git/hooks
```

# Usage

Step 1: set up your credentials

Step 2: start the server.
```bash
jiraf start
```

Step 3: use the built-in help to learn about the available commands.
```bash
jiraf help
```
