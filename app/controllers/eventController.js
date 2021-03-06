const Events = require('../database/models/events');
const Ticket = require('../database/models/ticket');

exports.getAllEvents = async (req, res) => {
	let eventList = [];
	try {
		eventList = await Events.find();
	} catch (err) {
		res.json({ success: false, eventList, error: err });
		return;
	}
	res.json({ success: true, eventList });
}

exports.getAllEventsForDropdown = async (req, res) => {
	let eventList = [];
	try {
		eventList = await Events
			.find()
			.select('name cost_1 cost_2 cost_4')
	} catch (err) {
		res.json({ success: false, eventList, error: err });
		return;
	}
	res.json({ success: true, eventList });
}

exports.getEvent = async (req, res) => {
	let name = req.params.name;
	let event = null;
	try {
		event = await Events.findOne({ name });
	} catch (err) {
		res.json({ success: false, event, error: err });
	}
	res.json({ success: true, event });
}

exports.addEvent = async (req, res) => {
	let event = req.body.event;
	let newEvent = new Events(event);
	try {
		await newEvent.save();
	} catch (err) {
		res.json({ success: false, error: err });
		return;
	}
	res.json({ success: true });
}

exports.deleteEvent = async (req, res) => {
	let eventId = req.body.eventId;
	if (eventId) {
		try {
			await Events.findByIdAndDelete({ _id: eventId });
		} catch (err) {
			res.json({ success: false, error: err });
			return;
		}
		res.json({ success: true });
	} else {
		res.json({ success: false, error: 'no such event' });
	}
}

exports.editEvent = async (req, res) => {
	let event = req.body.event;
	if (event) {
		try {
			await Events.findByIdAndUpdate({ _id: event._id }, event);
		} catch (err) {
			res.json({ success: false, error: err });
		}
		res.json({ success: true });
	} else {
		res.json({ success: false, error: 'no data passed' })
		return;
	}
}

exports.getAllEventSoldStats = async (req, res) => {
	try {
		let allEvents = await Events.find().select('name');
		let returnData = []
		for (let i = 0; i < allEvents.length; i++) {
			let tickets = await Ticket.find({ event: allEvents[i]._id })
				.select('paid');
			let totalSold = tickets.length;
			let totalCollected = 0;
			tickets.map(ticket => {
				totalCollected = totalCollected + ticket.paid
			});
			returnData.push({
				totalSold,
				totalCollected,
				event: allEvents[i]
			})
		}
		res.json({ success: true, stats: returnData });
	} catch (err) {
		console.log(err);
		res.json({ success: false, stats: [], error: err })
	}
}