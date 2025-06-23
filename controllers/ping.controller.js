
export const ping = async (req, res) => {
    try { 
        res.status(200).json({ message: 'Ping successful' });
    } catch (error) {
        res.status(500).json({ message: 'Ping failed', error: error.message });
    }
};
