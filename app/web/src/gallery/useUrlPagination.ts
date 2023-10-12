import { useSearchParams } from "react-router-dom"

export function useUrlPagination() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pagination = {
    pageNumber: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("pageSize") || "100"),
  }
  return {
    pagination,
    setPage: (pageNumber: number) => {
      setSearchParams(
        new URLSearchParams({
          page: (pageNumber - 1).toString(),
          pageSize: pagination.pageSize.toString(),
        }).toString(),
        { replace: false },
      )
    },
  }
}
