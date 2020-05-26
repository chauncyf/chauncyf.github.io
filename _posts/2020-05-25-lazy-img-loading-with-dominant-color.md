---
layout: post
title: Lazy img loading with dominant color
date: 2020-05-25 19:00 -0400
author: Chauncy
category: blog
tags: [coding, frontend, javascript, ruby]
published: true
---

A pure static site just makes everything far more complicated
{:.lead}


## Idea

The idea of lazy image loading is simple - the image wont be loaded until it become visible in the browser (i.e. viewport).

Actually, modern browsers support [native lazy loading](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading), simple add `loading="lazy"` to the img tag, and, that's it.
```html
<img src="image.jpg" loading="lazy" alt="..." />
```

This simple approach works. However, since height of the \<img/> element is 0 before load, this will cause content reflow.  
To prevent content reflow, we can use "placeholders". For example, low resolution thumbnails.  

Here, I'll take the dominant color from an image, and generate a tiny pixel thumbnail based on that color (just like Twitter did). 

|before load|after load|
|:---:|:---:|
|![before](/assets/img/dominant_color_pre.jpg){: .img-fluid}|![after](/assets/img/dominant_color_post.jpg){: .img-fluid}|

<br>


## Preparation

Jekyll is a static site generator, which means the whole website will be static. There are no controllers, no databases, only static files.

The only thing we can do is to store required data in the HTML itself and have JavaScript to do the work:  
```html
<img src="thumbnail.jpg" data-src="fullSize.jpg" alt="...">
```
When the img was scrolled into view (using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)), replace the value of src attribute with value of data-src attribute:
```javascript
const img = document.querySelector('img');
img.setAttribute('src', img.dataset.src);  // when scrolled into view
```

That's all needed for frontend part. 

For "backend", we can create a [Hooks](https://jekyllrb.com/docs/plugins/hooks/) to process images and use gem [Miro](https://github.com/jonbuda/miro) find dominant colors.


## Solution
As discussed [here](https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/), I'll use URL-encoded SVG as placeholder.

In the hooks _GenerateThumbnail.rb_:
```ruby
require 'json'
require 'miro'
require 'image_size'

Jekyll::Hooks.register :site, :after_init do |site|  # just after the site initializes
  data_file_path = File.join('.', '_data', 'gallery.json')

  unless File.exist?(data_file_path)
    puts 'Hooks: finding image dominant color..'

    gallery_path = File.join('assets', 'gallery')
    gallery_data = []
    Miro.options[:color_count] = 1  # only take one dominant color

    Dir.children(gallery_path).sort.each do |img|
      puts "\t> processing image: #{img}"

      img_path = File.join('.', gallery_path, img)
      img_dimensions = ImageSize.path(img_path).size  # get dimensions of image
      img_dominant_color = Miro::DominantColors.new(img_path).to_rgb[0]  # get dominant color of image

      # store data as array of hashes
      gallery_data.push({
                            'name': img,
                            'basename': img.split('.')[0],
                            'path': File.join('', gallery_path, img),
                            'width': img_dimensions[0],
                            'height': img_dimensions[1],
                            'dominant_color': img_dominant_color.join(',')  # rgb value
                        })
    end

    File.open(data_file_path, 'w') { |f| f.write(gallery_data.to_json) }  # save as json
  end
end
```

The generated json file will looks like this:
```json
[
  {
    "name": "DSC01881W.jpg",
    "basename": "DSC01881W",
    "path": "/assets/gallery/DSC01881W.jpg",
    "width": 1920,
    "height": 1280,
    "dominant_color": "72,57,53"
  },
  {
    "name": "DSC03916W.jpg",
    "basename": "DSC03916W",
    "path": "/assets/gallery/DSC03916W.jpg",
    "width": 1920,
    "height": 817,
    "dominant_color": "147,166,92"
  }
]
```

The HTML:
{% raw %}
```html
<!-- this is liquid syntax, it will iterate through the json file generated above -->
{% for image in site.data.gallery %}

    <!-- set background color of parent container as dominant color -->
    <div class="card" style="background-color: rgb({{ image.dominant_color }})">  
        
        <!-- here src is URL-encoded SVG, we need to specify the width and height -->
        <img src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {{ image.width }} {{ image.height }}"%3E%3C/svg%3E'
             data-src="{{ image.path }}" alt="{{ image.basename }}" class="card-img" style="opacity: 0">
    </div>

{% endfor %}
```
{% endraw %}

And JavaScript:
```html
<script>
    let intersectionObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let element = entry.target;
                element.setAttribute('src', element.dataset.src);
                element.onload = function () {
                    element.style.cssText = 'opacity: 1; transition: all 0.5s ease-in-out;';
                };
                observer.unobserve(element);
            }
        });
    });

    window.onload = function () {
        document.querySelectorAll('.card-img').forEach(img => {
            intersectionObserver.observe(img);
        });
    };
</script>
```

<br>
Checkout the [final result]({% link photo.html %})!


## References
- [https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/](https://css-tricks.com/preventing-content-reflow-from-lazy-loaded-images/)
- [https://www.sitepoint.com/five-techniques-lazy-load-images-website-performance/](https://www.sitepoint.com/five-techniques-lazy-load-images-website-performance/)
- [https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)