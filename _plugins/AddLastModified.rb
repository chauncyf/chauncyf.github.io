Jekyll::Hooks.register :posts, :pre_render do |post|
  # get the current post last modified time
  modification_time = File.mtime(post.path)
  # inject modification_time in post's data
  post.data['last_modified'] = modification_time

  if post.data['category'] == 'private'
    post.data['sitemap'] = false
  end
end