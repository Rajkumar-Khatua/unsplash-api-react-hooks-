import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/Toast";
import Form from "react-bootstrap/Form";
import { categoryData } from "./categoryData";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";

const IMAGES_PER_PAGE = 10;
function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      if (!searchInput.current.value) return;
      setLoading(true);
      setError("");
      const { data } = await axios.get(
        `${API_URL}?query=${
          searchInput.current.value
        }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
          import.meta.env.VITE_API_KEY
        }`
      );
      setImages(data.results);
      setTotalPages(data.total_pages);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.error(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  console.log("page", page);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };
  const handleSearch = (event) => {
    event.preventDefault();
    console.log(searchInput.current.value);
    document.getElementById(
      "sample"
    ).innerHTML = `You searched for: ${searchInput.current.value}`;
    resetSearch();
  };

  const handleSelect = (selection) => {
    searchInput.current.value = selection;
    resetSearch();
  };

  return (
    <Container>
      <h1 className="title">Image Search</h1>
      <div className="search-section">
        <Form onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search for images"
            className="search-input"
            ref={searchInput}
          ></Form.Control>
        </Form>
        <a id="sample"></a>
      </div>
      <div className="filters">
        {categoryData.map((category) => (
          <Button
            variant="outline-info"
            key={category}
            onClick={() => handleSelect(category.toLowerCase())}
          >
            {category}
          </Button>
        ))}
      </div>

      {loading ? (
        <Spinner animation="border" role="status" />
      ) : (
        <>
          {error && (
            <Toast bg="danger" onClose={() => setError(null)}>
              <Toast.Header>
                <strong className="me-auto">Something west wrong!</strong>
              </Toast.Header>
              <Toast.Body>{error.message}</Toast.Body>
            </Toast>
          )}
          <div className="images">
            {images.map((image) => (
              <Image
                key={image.id}
                src={image.urls.small}
                alt={image.alt_description}
                rounded
              />
            ))}
          </div>

          <div className="buttons">
            {page > 1 && (
              <Button
                variant="info"
                onClick={() => {
                  setPage(page - 1);
                }}
              >
                Previous
              </Button>
            )}
            Page: {page} of {totalPages}
            {"  "}:{" "}
            {page < totalPages && (
              <Button
                variant="info"
                onClick={() => {
                  setPage(page + 1);
                }}
              >
                Next
              </Button>
            )}
            Go to desired page
            <Form.Control
              type="number"
              min="1"
              max={totalPages}
              value={page}
              onChange={(event) => {
                setPage(parseInt(event.target.value));
              }}
            ></Form.Control>
          </div>
        </>
      )}
    </Container>
  );
}

export default App;
