import { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import propertiesService from "src/apis/propertiesService"; // Update with your actual service import

const PropertyVerificationRequests = () => {
  const [propertyListing, setPropertyListing] = useState([]);

  // Function to fetch all property listings
  const getAllPropertyListings = async () => {
    try {
      const res = await propertiesService.getAllPropertyListings(); // Replace with your actual API method
      if (res.data) {
        setPropertyListing(res.data.properties);
      } else {
        console.error("No properties found");
      }
    } catch (error) {
      console.error("Error fetching all property listings:", error);
    }
  };

  // Fetch listings on component mount
  useEffect(() => {
    getAllPropertyListings();
  }, []);

  // Helper function to format address
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { street_address, city, state, zip_code } = address;
    return `${street_address}, ${city}, ${state} ${zip_code}`;
  };

  // Render properties
  return (
    <div style={{ padding: "20px" }}>
      <h2>All Property Listings</h2>
      <Row gutter={[16, 16]}>
        {propertyListing.length > 0 ? (
          propertyListing.map((property) => (
            <Col key={property.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={property.title || "Unnamed Property"}
                hoverable
                style={{ width: "100%" }}
              >
                <p>Address: {formatAddress(property.address)}</p>
                <p>Status: {property.status_verification || "N/A"}</p>
                <p>Rent: ${property.rent || "N/A"}</p>
              </Card>
            </Col>
          ))
        ) : (
          <p>No properties available.</p>
        )}
      </Row>
    </div>
  );
};

export default PropertyVerificationRequests;