/**
 * JSON 404 response
 */

const fourOhFour = (req, res) => {
    return res.status(404).json({ message: 'not found' });
};

export default fourOhFour;
