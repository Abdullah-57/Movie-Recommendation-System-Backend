import Crew from "../models/Crew.js";

export const addCrewMember = async (req, res) => {
  try {
    const crew = new Crew(req.body);
    await crew.save();
    res.status(201).json({ message: "Crew member added successfully", crew });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCrewMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCrew = await Crew.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedCrew) return res.status(404).json({ message: "Crew member not found" });
    res.json({ message: "Crew member updated successfully", updatedCrew });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
