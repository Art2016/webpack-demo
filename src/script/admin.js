import $ from "jquery";
import people from './lib/people';

$('.text').append(`There are ${people.length} people.`);
