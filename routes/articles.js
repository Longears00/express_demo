
import express from 'express';
import Article from '../models/article';
const router = express.Router();

router.get('/add', (req, res)=> {

    res.render('add', {
        title: 'add article',

      });
  });

//edit single articles
router.get('/edit/:id', (req, res)=> {
  Article.findById(req.params.id, (err, article)=> {
    if (err) {
      console.log(err);
    }else {
      res.render('edit_article', {
          article: article,
        });
    }
  });
});

//edit article post
router.post('/edit/:id', (req, res)=> {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };
  Article.update(query, article, (err)=> {
      if (err)
      {
        console.log(err);
      } else {
        req.flash('success', 'article edited');
        res.redirect('/');
      }
    });
});

//add article post
router.post('/add', (req, res)=> {
    req.checkBody('title', 'title is required').notEmpty();

    //get errors
    let errors = req.validationErrors();
    if (errors) {
      res.render('add', {
          title: 'add article',
          errors: errors,
        });
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;
      article.save((err)=> {
          if (err)
          {
            console.log(err);
          } else {
            req.flash('success', 'article added');
            res.redirect('/');
          }
        });
    }
  });

//delete article
router.delete('/:id', (req, res)=> {
      let query = { _id: req.params.id };
      Article.remove(query, (err)=> {
          if (err)
          {
            console.log(err);
          } else {
            res.send('success');
          }
        });
    });

//get single articles
router.get('/:id', (req, res)=> {
  Article.findById(req.params.id, (err, article)=> {
    if (err) {
      console.log(err);
    }else {
      res.render('article', {
          article: article,
        });
    }
  });
});
module.exports = router;
