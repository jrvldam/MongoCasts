const assert = require('assert');
const mongoose = require('mongoose');

const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, comment, blogPost;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([
        joe.save(),
        blogPost.save(),
        comment.save()
    ]).then(() => done());
  });

  it('saves a relation between a user and a blog post', (done) => {
    User.findOne({ name: 'Joe' })
        .populate('blogPosts')
        .then((user) => {
          assert(user.blogPosts[0].title === 'JS is great');
          done();
        });
  });

  it('saves a full relation graph', (done) => {
    User.findOne({ name: 'Joe' })
        .populate({
          path: 'blogPosts',
          populate: {
            path: 'comments',
            model: 'comment',
            populate: {
              path: 'user',
              model: 'user',
            },
          },
        })
        .then((user) => {
          assert(user.name === 'Joe');
          assert(user.blogPosts[0].title === 'JS is great');
          assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
          assert(user.blogPosts[0].comments[0].user.name === 'Joe');

          done();
        });
  });
});