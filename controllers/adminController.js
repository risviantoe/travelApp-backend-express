const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Users = require('../models/Users');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
	viewSignin: (req, res) => {
		try {
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			if (req.session.user === null || req.session.user === undefined) {
				res.render('index', {
					alert,
					title: 'Staycation | Login',
				});
			} else {
				res.redirect('/admin/dashboard');
			}
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/signin');
		}
	},

	actionSignin: async (req, res) => {
		try {
			const { username, password } = req.body;
			const user = await Users.findOne({ username: username });
			if (!user) {
				req.flash('alertMsg', 'User tidak ditemukan!');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}
			const isPasswordMatch = await bcrypt.compare(
				password,
				user.password
			);
			if (!isPasswordMatch) {
				req.flash('alertMsg', 'Password yang dimasukkan salah!');
				req.flash('alertStatus', 'danger');
				res.redirect('/admin/signin');
			}

			req.session.user = {
				id: user.id,
				username: user.username,
			};

			res.redirect('/admin/dashboard');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/signin');
		}
	},

	actionLogout: (req, res) => {
		req.session.destroy();
		res.redirect('/admin/signin');
	},

	viewDashboard: async (req, res) => {
		try {
			const member = await Member.find();
			const booking = await Booking.find();
			const item = await Item.find();
			res.render('admin/dashboard/view_dashboard', {
				title: 'Staycation | Dashboard',
				user: req.session.user,
				member,
				booking,
				item,
			});
		} catch (error) {}
		// res.redirect('/admin/dashboard')
	},

	viewCategory: async (req, res) => {
		try {
			const category = await Category.find();
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			res.render('admin/category/view_category', {
				category,
				alert,
				title: 'Staycation | Category',
				user: req.session.user,
			});
		} catch (error) {
			res.redirect('/admin/category');
		}
	},

	addCategory: async (req, res) => {
		try {
			const { name } = req.body;
			await Category.create({ name });
			req.flash('alertMsg', 'Success add category!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	editCategory: async (req, res) => {
		try {
			const { id, name } = req.body;
			const category = await Category.findOne({ _id: id });
			category.name = name;
			await category.save();
			req.flash('alertMsg', 'Success update category!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.body;
			const category = await Category.findOne({ _id: id });
			await category.remove();
			req.flash('alertMsg', 'Success delete category!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/category');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/category');
		}
	},

	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find();
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			res.render('admin/bank/view_bank', {
				bank,
				alert,
				title: 'Staycation | Bank',
				user: req.session.user,
			});
		} catch (error) {
			res.redirect('/admin/bank');
		}
	},

	addBank: async (req, res) => {
		try {
			const { bankName, accountNumber, accountHolder } = req.body;
			await Bank.create({
				bankName,
				accountNumber,
				accountHolder,
				imageUrl: `images/${req.file.filename}`,
			});
			req.flash('alertMsg', 'Success add bank!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	editBank: async (req, res) => {
		try {
			const { bankId, bankName, accountNumber, accountHolder } = req.body;
			const bank = await Bank.findOne({ _id: bankId });
			if (req.file === undefined) {
				bank.bankName = bankName;
				bank.accountNumber = accountNumber;
				bank.accountHolder = accountHolder;
				await bank.save();
			} else {
				await fs.unlink(path.join(`public/${bank.imageUrl}`));
				bank.bankName = bankName;
				bank.accountNumber = accountNumber;
				bank.accountHolder = accountHolder;
				bank.imageUrl = `images/${req.file.filename}`;
				await bank.save();
			}
			req.flash('alertMsg', 'Success update bank!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	deleteBank: async (req, res) => {
		try {
			const { id } = req.body;
			const bank = await Bank.findOne({ _id: id });
			await fs.unlink(path.join(`public/${bank.imageUrl}`));
			await bank.remove();
			req.flash('alertMsg', 'Success delete bank!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/bank');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/bank');
		}
	},

	viewItem: async (req, res) => {
		try {
			const item = await Item.find()
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			const category = await Category.find();
			res.render('admin/item/view_item', {
				title: 'Staycation | Item',
				alert,
				category,
				item,
				action: 'view',
				user: req.session.user,
			});
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	addItem: async (req, res) => {
		try {
			const { categoryId, title, price, city, description } = req.body;
			if (req.files.length > 0) {
				const category = await Category.findOne({ _id: categoryId });
				const newItem = {
					categoryId: category._id,
					title,
					price,
					city,
					description,
				};
				const item = await Item.create(newItem);
				category.itemId.push({ _id: item._id });
				await category.save();
				for (let i = 0; i < req.files.length; i++) {
					const saveImage = await Image.create({
						imageUrl: `images/${req.files[i].filename}`,
					});
					item.imageId.push({ _id: saveImage._id });
					await item.save();
				}
				req.flash('alertMsg', 'Success add item!');
				req.flash('alertStatus', 'success');
				res.redirect('/admin/item');
			}
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	showImageItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id }).populate({
				path: 'imageId',
				select: 'id imageUrl',
			});
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			const category = await Category.find();
			res.render('admin/item/view_item', {
				title: 'Staycation | Item',
				alert,
				category,
				item,
				action: 'show image',
				user: req.session.user,
			});
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	showEditItem: async (req, res) => {
		try {
			const { id } = req.params;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			const category = await Category.find();
			res.render('admin/item/view_item', {
				title: 'Staycation | Edit Item',
				alert,
				category,
				item,
				action: 'edit',
				user: req.session.user,
			});
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	editItem: async (req, res) => {
		try {
			const { id } = req.params;
			const { categoryId, title, price, city, description } = req.body;
			const item = await Item.findOne({ _id: id })
				.populate({ path: 'imageId', select: 'id imageUrl' })
				.populate({ path: 'categoryId', select: 'id name' });
			if (req.files.length > 0) {
				for (let i = 0; i < item.imageId.length; i++) {
					const imageUpdate = await Image.findOne({
						_id: item.imageId[i].id,
					});
					await fs.unlink(
						path.join(`public/${imageUpdate.imageUrl}`)
					);
					imageUpdate.imageUrl = `images/${req.files[i].filename}`;
					await imageUpdate.save();
				}

				item.title = title;
				item.price = price;
				item.city = city;
				item.description = description;
				item.categoryId = categoryId;
				await item.save();
			} else {
				item.title = title;
				item.price = price;
				item.city = city;
				item.description = description;
				item.categoryId = categoryId;
				await item.save();
			}
			req.flash('alertMsg', 'Success update item!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/item');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	deleteItem: async (req, res) => {
		try {
			const { id } = req.body;
			const item = await Item.findOne({ _id: id }).populate('imageId');
			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({ _id: item.imageId[i]._id })
					.then(async (image) => {
						await fs.unlink(path.join(`public/${image.imageUrl}`));
						image.remove();
					})
					.catch((error) => {
						req.flash('alertMsg', error.message);
						req.flash('alertStatus', 'danger');
						res.redirect('/admin/item');
					});
			}
			await item.remove();
			req.flash('alertMsg', 'Success delete item!');
			req.flash('alertStatus', 'success');
			res.redirect('/admin/item');
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect('/admin/item');
		}
	},

	viewDetailItem: async (req, res) => {
		const { itemId } = req.params;
		try {
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			const feature = await Feature.find({ itemId: itemId });
			const activity = await Activity.find({ itemId: itemId });
			res.render('admin/item/detail_item/view_detail_item', {
				title: 'Staycation | Detail Item',
				alert,
				itemId,
				feature,
				activity,
				user: req.session.user,
			});
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	addFeature: async (req, res) => {
		const { name, qty, itemId } = req.body;
		try {
			if (!req.file) {
				req.flash('alertMsg', 'Image not found!');
				req.flash('alertStatus', 'danger');
				res.redirect(`/admin/item/detail/${itemId}`);
			}
			const feature = await Feature.create({
				name,
				qty,
				itemId,
				imageUrl: `images/${req.file.filename}`,
			});
			const item = await Item.findOne({ _id: itemId });
			item.featureId.push({ _id: feature._id });
			await item.save();
			req.flash('alertMsg', 'Success add feature!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	editFeature: async (req, res) => {
		const { name, qty, id, itemId } = req.body;
		try {
			const feature = await Feature.findOne({ _id: id });
			if (req.file === undefined) {
				feature.name = name;
				feature.qty = qty;
				await feature.save();
			} else {
				await fs.unlink(path.join(`public/${feature.imageUrl}`));
				feature.name = name;
				feature.qty = qty;
				feature.imageUrl = `images/${req.file.filename}`;
				await feature.save();
			}
			req.flash('alertMsg', 'Success update feature!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	deleteFeature: async (req, res) => {
		const { id, itemId } = req.body;
		try {
			const feature = await Feature.findOne({ _id: id });
			const item = await Item.findOne({ _id: itemId }).populate(
				'featureId'
			);
			for (let i = 0; i < item.featureId.length; i++) {
				if (
					item.featureId[i]._id.toString() === feature._id.toString()
				) {
					item.featureId.pull({ _id: feature._id });
					await item.save();
				}
			}
			await fs.unlink(path.join(`public/${feature.imageUrl}`));
			await feature.remove();
			req.flash('alertMsg', 'Success delete feature!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	addActivity: async (req, res) => {
		const { name, type, itemId, isPopular } = req.body;
		try {
			if (!req.file) {
				req.flash('alertMsg', 'Image not found!');
				req.flash('alertStatus', 'danger');
				res.redirect(`/admin/item/detail/${itemId}`);
			}
			const activity = await Activity.create({
				name,
				type,
				itemId,
				isPopular: isPopular,
				imageUrl: `images/${req.file.filename}`,
			});
			const item = await Item.findOne({ _id: itemId });
			item.activityId.push({ _id: activity._id });
			await item.save();
			req.flash('alertMsg', 'Success add activity!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	editActivity: async (req, res) => {
		const { name, type, isPopular, id, itemId } = req.body;
		try {
			const activity = await Activity.findOne({ _id: id });
			if (req.file === undefined) {
				activity.name = name;
				activity.type = type;
				activity.isPopular = isPopular;
				await activity.save();
			} else {
				await fs.unlink(path.join(`public/${activity.imageUrl}`));
				activity.name = name;
				activity.type = type;
				activity.isPopular = isPopular;
				activity.imageUrl = `images/${req.file.filename}`;
				await activity.save();
			}
			req.flash('alertMsg', 'Success update activity!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	deleteActivity: async (req, res) => {
		const { id, itemId } = req.body;
		try {
			const activity = await Activity.findOne({ _id: id });
			const item = await Item.findOne({ _id: itemId }).populate(
				'activityId'
			);
			for (let i = 0; i < item.activityId.length; i++) {
				if (
					item.activityId[i]._id.toString() ===
					activity._id.toString()
				) {
					item.activityId.pull({ _id: activity._id });
					await item.save();
				}
			}
			await fs.unlink(path.join(`public/${activity.imageUrl}`));
			await activity.remove();
			req.flash('alertMsg', 'Success delete activity!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/item/detail/${itemId}`);
		} catch (error) {
			req.flash('alertMsg', error.message);
			req.flash('alertStatus', 'danger');
			res.redirect(`/admin/item/detail/${itemId}`);
		}
	},

	viewBooking: async (req, res) => {
		try {
			const booking = await Booking.find()
				.populate('memberId')
				.populate('bankId');
			res.render('admin/booking/view_booking', {
				title: 'Staycation | Booking',
				user: req.session.user,
				booking,
			});
		} catch (error) {
			res.redirect('/admin/booking');
		}
	},

	showDetailBooking: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id })
				.populate('memberId')
				.populate('bankId');
			const alertMsg = req.flash('alertMsg');
			const alertStatus = req.flash('alertStatus');
			const alert = {
				message: alertMsg,
				status: alertStatus,
			};
			res.render('admin/booking/show_detail_booking', {
				title: 'Staycation | Detail Booking',
				user: req.session.user,
				booking,
				alert,
			});
		} catch (error) {
			console.log(error);
			res.redirect('/admin/booking');
		}
	},

	actionConfirmation: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id });
			booking.payments.status = 'Accept';
			await booking.save();
			req.flash('alertMsg', 'Success confirm pembayaran!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/booking/${id}`);
		} catch (error) {
			res.redirect(`/admin/booking/${id}`);
		}
	},

	actionReject: async (req, res) => {
		const { id } = req.params;
		try {
			const booking = await Booking.findOne({ _id: id });
			booking.payments.status = 'Rejected';
			await booking.save();
			req.flash('alertMsg', 'Success reject pembayaran!');
			req.flash('alertStatus', 'success');
			res.redirect(`/admin/booking/${id}`);
		} catch (error) {
			res.redirect(`/admin/booking/${id}`);
		}
	},
};
