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

Set up your credentials by putting this in a `~/.jiraf/.credentials.json` file, substituting the actual values:

```bash
{
  "JIRA_API_HOST": "foo",
  "JIRA_USERNAME": "bar",
  "JIRA_API_TOKEN": "baz"
}
```

Optionally, to add the jiraf information to your prompt:
__Using fish__
```bash
cp ~/jiraf/cli/jiraf_prompt.fish ~/.config/fish/functions
funced fish_prompt  # insert usage
```

__Using other shells__
Figure it out :P

Optionally, to set up branch-to-ticket auto-tracking in a given git repository:
```bash
cd /path/to/my/repo
cp ~/jiraf/git/post-checkout .git/hooks
```

# Usage

Step 1: start the server.
```bash
jiraf start
```

Step 2: use the built-in help to learn about the available commands.
```bash
jiraf help
```
