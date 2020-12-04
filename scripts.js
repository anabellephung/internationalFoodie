const restaurantApp = {};
restaurantApp.apiKey = 'f2af26c3d6f76bd1f3cc5cba0be539fa';

// Hide header and show city gallery
$('#showGallery').click(function () {
  $('header').fadeOut(600, 'linear', function () {
    $('.cityGallery').fadeIn();
  })
})

// Promise - render restaurants (depending on click value of city)
restaurantApp.getCityRestaurants = async function(city) {
  try {
    const res = await axios.get(`https://developers.zomato.com/api/v2.1/locations?query=${city}&count=1`, {
      headers: {
        'user-key': restaurantApp.apiKey
      }
    });

    const cityId = res.data['location_suggestions'][0].entity_id;

    const res2 = await axios.get(`https://developers.zomato.com/api/v2.1/search?entity_id=${cityId}&entity_type=city&q=${city}&count=10&sort=rating&order=desc`, {
      headers: {
        'user-key': restaurantApp.apiKey
      }
    })
      // returns an array of restaurants of chosen city
      const restaurantList = res2.data['restaurants'];
      restaurantApp.displayRestaurants(restaurantList);

      return restaurantList

  } catch (err) {
    // error handling with sweetalert
    swal({
      title: "Restaurants currently unavailable!",
      text: "Please try again another time.",
      icon: "error",
      button: "OK"
    });
  }
}

restaurantApp.displayRestaurants = function(restaurantList) {
  // for each restaurant in restaurant array compiled in promise 
  restaurantList.forEach((restaurant) => {
    $.each(restaurant, function (key, value) {
      const restaurantDetails = value;
      const resId = restaurantDetails.id;

      const restoListToAppend = `
        <li class="restaurant" value="${resId}">
          <h4>${restaurantDetails.name}</h4>
          <p>${restaurantDetails.cuisines}</p>
        </li>
      `;

      $('.restaurantList').append(restoListToAppend);

      // can then click on specific restaurant and will display specifics
      $('.restaurant').click(function () {
        const val = $(this).attr("value");
        $('.cityRestaurants').fadeOut(800, 'linear', function () {
          $('.restaurantInfo').addClass('flexRestaurant').fadeIn(1000);
        })

        // if id from API === value appended onto each restaurant
        if (val === resId) {
          const thisRestaurant = restaurant.restaurant;
          const img = restaurant.restaurant.featured_image;
          const imgLength = img.length;

          const restoToDisplay = `
            <h4>${thisRestaurant.name}</h4>
            <div class="detailsContainer">
              <p><span class="specialStyling">Specialty</span>: ${thisRestaurant.cuisines}</p>
              <p><span class="specialStyling">Neighborhood</span>: ${thisRestaurant.location.locality}</p>
              <p><span class="specialStyling">Offerings</span>: <a href='${thisRestaurant.menu_url}' target='_blank'>Menu</a></p>
              <p><span class="specialStyling">Worldwide Rating</span>: ${thisRestaurant.user_rating.aggregate_rating}/5⭐</p>
              <div class="imgBox">
                <img src="${img}" alt="${thisRestaurant.name}'s featured image">
              </div>
            </div> 
            <button class="anotherRestaurant" id="anotherRestaurant">Choose another restaurant</button>
          `;

          const restoToDisplay2 = `
            <h4>${thisRestaurant.name}</h4>
            <div class="detailsContainer">
              <p><span class="specialStyling">Specialty</span>: ${thisRestaurant.cuisines}</p>
              <p><span class="specialStyling">Neighborhood</span>: ${thisRestaurant.location.locality}</p>
              <p><span class="specialStyling">Offerings</span>: <a href='${thisRestaurant.menu_url}' target='_blank'>Menu</a></p>
              <p><span class="specialStyling">Worldwide Rating</span>: ${thisRestaurant.user_rating.aggregate_rating}/5⭐</p>
            </div> 
            <button class="anotherRestaurant" id="anotherRestaurant">Choose another restaurant</button>
          `;

          // if there is an img, display this
          if (imgLength > 0) {
            $('.restaurantDetails').html(restoToDisplay);
          }
          // if there is no img, display this instead
          else {
            $('.restaurantDetails').html(restoToDisplay2);
          }
        }

        // Choose another restaurant - hide current restaurant page and show restaurant list
        $('#anotherRestaurant').on('click', function () {
          $('.restaurantInfo').fadeOut(800, 'linear', function () {
            $('.cityRestaurants').fadeIn(1000);
          })
        })
      })
    })
  })
  // Choose another city
  $('#anotherCity').on('click', function () {
    $('.cityRestaurants').fadeOut(800, 'linear', function () {
      $('.cityGallery').fadeIn(1000);
    })
    $('.preload').fadeIn();
  })
}

restaurantApp.init = (function () {
  // on click of city, promise will render restaurant list
  $('.city').click(function () {
    const city = $(this).attr("value");
    $('.cityGallery').fadeOut(800, 'linear', function () {
      $('.restaurantList').empty();
      $(".preload").fadeOut(2000);
      restaurantApp.getCityRestaurants(city)
      $('.cityTitle').text(city);
      $(".cityRestaurants").fadeIn(1000);
    })
  })
})

// Doc ready
$(function () {
  restaurantApp.init();
});