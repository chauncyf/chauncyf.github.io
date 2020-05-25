Jekyll::Hooks.register :posts, :pre_render do |post|
  # puts "Hooks: processing post #{post.data['title']}"

  modification_time = File.mtime(post.path)
  post.data['last_modified'] = modification_time
  post.data['sitemap'] = false if post.data['category'] == 'private'
end