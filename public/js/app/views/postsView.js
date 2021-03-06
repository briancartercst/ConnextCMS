/*global define*/
define([
	'jQuery-2.1.4.min',
	'underscore_1.3.3',
	'backbone_0.9.2',
  'text!../../../js/app/templates/posts.html'
], function ($, _, Backbone, PostsTemplate) {
	'use strict';

	var PostsView = Backbone.View.extend({

		tagName:  'div',
    
    el: '#postsView',  

		template: _.template(PostsTemplate),

		// The DOM events specific to an item.
		events: {

		},

		initialize: function () {

		},

    render: function () {      
      //debugger;
      
      this.$el.html(this.template);

      this.populateTable();
      
			return this;
		},
    
    populateTable: function() {
      //debugger;
      
      //Loop through each model in the collection.
      for( var i = 0; i < global.postsCollection.length; i++ ) {
      
        try {
          //debugger;

          var model = global.postsCollection.models[i];
          
          //Handle corner case of new install with empty DB
          if( (global.postsCollection.models.length == 1) && (model.id == "") ) {
            return;
          }
          
          //Clone the example row provided in the template.
          var tempRow = global.postsView.$el.find('#postRow').clone();

          //Clear the ID copied from the example row.
          tempRow.attr('id', '');

          //Populate the new row with data from the model.
          var postTitle = model.get('title');
          tempRow.find('th').html('<a href="#/">'+postTitle+'</a>');
          tempRow.find('th').find('a').attr('onclick', 'global.postsView.editPost('+i+')');
          
          //Dev Note: The author name should display a 'name' instead of a GUID in its present form, just
          //like the code below for categories does. However, I need to first create a Backbone Model and
          //Collection for user data.
          tempRow.find('.postAuthor').text(model.get('author'));
          
          //Find and display the category name for this post.
          for( var j=0; j < global.postCategoryCollection.models.length; j++ ) {
            //To-Do: handle posts that are assigned no sections.
            var postCategoryGUID = model.get('categories')[0];
            
            //Match up the GUIDs and display the name of the matching category.
            if( global.postCategoryCollection.models[j].id == postCategoryGUID ) {
              tempRow.find('.postCategories').text(global.postCategoryCollection.models[j].get('name'));
              break;
            }
          }

          var publishedDate = model.get('publishedDate'); //Get date string from model.
          publishedDate = new Date(publishedDate.slice(0,4), publishedDate.slice(5,7)-1, publishedDate.slice(8,10)); //Convert date string to Date object.
          var datestr = (publishedDate.getMonth()+1)+'/'+publishedDate.getDate()+'/'+publishedDate.getFullYear();
          tempRow.find('.postDate').text(datestr);

          //Remove the 'hidden' attribute copied from the example row.
          tempRow.show();

          //Append the new row to the DOM.
          global.postsView.$el.find('#postsTable').append(tempRow);
          
        } catch(err) {
          console.error('Error encountered in postsView.populateTable(). Error message:');
          console.error(err.message);
          
          log.push('Error encountered in postsView.populateTable(). Error message:')
          log.push(err.message)
          sendLog();
        }
        
      }
      
    },
    
    editPost: function(model_index) {
      //debugger;
      
      $('#postsView').hide();
      $('#postsAddNewView').show();
      
      $('#app-location').text('Posts : Edit Post');
      
      //Load the currently selected model into the TinyMCE state variable so that once
      //the TinyMCE editor has been loaded, it knows which model to load.
      global.tinymce.currentModelIndex = model_index;
      
      //Render the Add New pages View view.
      global.postsAddNewView.render();
      
    }
    

	});

  //debugger;
	return PostsView;
});
