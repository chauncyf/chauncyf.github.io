# Chauncy's Space
![](https://github.com/chauncyf/chauncyf.github.io/workflows/GitHub%20Pages/badge.svg)

Personal blog, build from scratch with Jekyll & JavaScript  

## Stack

### Development
- HTML, Sass, JavaScript, jQuery, AJAX
- [Jekyll](https://jekyllrb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Animate.css](https://animate.style/)
- [Valine](https://valine.js.org/)

### CI / Deployment
- GitHub Actions
- GitHub Pages


## Useful Commands

### Local Server

    $ bundle exec jekyll serve

### Jekyll::Compose

Create new page using:

    $ bundle exec jekyll page "My New Page"

Create new post using:

    $ bundle exec jekyll post "My New Post"

Create new draft using:

    $ bundle exec jekyll draft "My new draft"

Publish draft using:

    $ bundle exec jekyll publish _drafts/my-new-draft.md
    # or specify a specific date on which to publish it
    $ bundle exec jekyll publish _drafts/my-new-draft.md --date 2014-01-24

Unpublish post using:

    $ bundle exec jekyll unpublish _posts/2014-01-24-my-new-draft.mdnew-draft.md