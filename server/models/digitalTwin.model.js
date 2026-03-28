const mongoose = require('mongoose');

const digitalTwinSimulationSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required'],
      index: true,
    },
    simulation_trigger: {
      type: String,
      required: [true, 'Simulation trigger is required'],
    },
    projected_health_score: {
      type: Number,
      required: [true, 'Projected health score is required'],
    },
    projected_timeline_impact: { type: String },
    simulation_date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    collection: 'digital_twin_simulations',
  }
);

module.exports = mongoose.model('Digital_Twin_Simulations', digitalTwinSimulationSchema);
