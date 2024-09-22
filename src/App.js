import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Component starts here
function App() {
  const queryClient = useQueryClient();

  // Fetching data using useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
        res.json()
      ),
    refetchInterval: 3000,
    refetchOnWindowFocus: false,
    retry: 5
  });
  console.log(error);

  // Define mutation function
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (newPost) =>
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-Type": "application/json; charset=UTF-8" },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      // Update the cache to include the newly added post
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]);
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="App">
      {/* Display pending state when the mutation is in progress */}
      {isPending && <p>Data is being added...</p>}

      {/* Display success message without blocking the post list */}
      {isSuccess && <p>Post added successfully!</p>}

      {/* Button to trigger post creation */}
      <button
        onClick={() =>
          mutate({
            userId: 5000,
            id: 101,
            title: "Tharun Lanjakodaka",
            body: "Tharun nee ammanu denga",
          })
        }
      >
        Add post
      </button>

      {/* Display fetched posts */}
      {data?.map((todo) => (
        <div key={todo.id}>
          <h1>ID: {todo.id}</h1>
          <h1>Title: {todo.title}</h1>
          <p>{todo.body}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
