const Order = require('../models/order');
// const CheckList = require('../models/checklist');
// const Answer = require('../models/answer');

// exports.getClientTracking = async (req, res) => {
//   try {
//     // Logged-in user from JWT
//     const loggedInUser = req.user; // comes from protect middleware

//     // Role check — only clients can access tracking
//     if (loggedInUser.role !== 'client') {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Only clients can track orders.'
//       });
//     }

//     //  Get all orders of this client
//     const clientId = loggedInUser.id;

//     const orders = await Order.aggregate([
//       { $match: { clientId } },

//       //  Lookup checklist details
//       {
//         $lookup: {
//           from: 'checklists',
//           localField: 'checklistId',
//           foreignField: 'id',
//           as: 'checklistDetails'
//         }
//       },

//       // Lookup inspection answers
//       {
//         $lookup: {
//           from: 'answers',
//           localField: 'id',
//           foreignField: 'orderId',
//           as: 'inspectionAnswers'
//         }
//       },

//       //  Format output
//       {
//         $project: {
//           _id: 0,
//           id: 1,
//           productName: 1,
//           quantity: 1,
//           status: 1,
//           createdAt: 1,
//           updatedAt: 1,
//           checklistName: { $arrayElemAt: ['$checklistDetails.name', 0] },
//           inspectionDoneBy: {
//             $arrayElemAt: ['$inspectionAnswers.filledBy', 0]
//           },
//           inspectionDate: {
//             $arrayElemAt: ['$inspectionAnswers.submittedAt', 0]
//           },
//           // Count all questions in all sections
//           totalQuestions: {
//             $size: {
//               $ifNull: [
//                 {
//                   $reduce: {
//                     input: { $arrayElemAt: ['$checklistDetails.sections', 0] },
//                     initialValue: [],
//                     in: { $concatArrays: ['$$value', '$$this.questions'] }
//                   }
//                 },
//                 []
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     res.status(200).json({
//       success: true,
//       message: 'Client tracking data fetched successfully',
//       data: orders
//     });
//   } catch (err) {
//     console.error('Tracking error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching client tracking data',
//       error: err.message
//     });
//   }
// };
exports.getOrdersByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const loggedInUser = req.user;

      if (!loggedInUser) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }
     if (loggedInUser.role === 'client') {
      if (loggedInUser.id !== Number(clientId)) {
        return res.status(403).json({ message: 'Access denied. You can only view your own orders.' });
      }
    }
     else if (loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin or client can access.' });
    }

    const orders = await Order.find({ clientId: Number(clientId) })
      .populate('createdBy', 'name email role')
      .populate('inspectionConfirmedBy', 'name email role')
      .populate('procurementConfirmedBy', 'name email role');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this client' });
    }

    res.status(200).json({
      message: 'Orders fetched successfully for client',
      clientId,
      total: orders.length,
      orders
    });
  } catch (err) {
    console.error('Error fetching client orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getOrdersForAdmin = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const { clientId, orderId } = req.query;
    const filter = {};

    
    if (clientId) {
      const parsedClientId = parseInt(clientId);
      if (isNaN(parsedClientId)) {
        return res.status(400).json({ message: 'Invalid clientId format' });
      }
      filter.clientId = parsedClientId;
    }

    
    if (orderId) {
      const parsedOrderId = parseInt(orderId);
      if (isNaN(parsedOrderId)) {
        return res.status(400).json({ message: 'Invalid orderId format' });
      }
      filter.id = parsedOrderId;
    }
    const orders = await Order.find(filter)
      .populate('createdBy', 'name email role')
      .populate('inspectionConfirmedBy', 'name email role')
      .populate('procurementConfirmedBy', 'name email role');

    res.status(200).json({
      message: '  Orders fetched successfully',
      total: orders.length,
      orders
    });
  } catch (err) {
    console.error(' Error fetching orders for admin:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
