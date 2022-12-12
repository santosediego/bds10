import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import './styles.css';
import { hasAnyRoles } from 'util/auth';

type ControlComponentsData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();
  const [controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>({ activePage: 0, });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({
      activePage: pageNumber
    })
  };

  useEffect(() => {
    const params: AxiosRequestConfig = {
      url: '/employees',
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 12,
      },
    };

    requestBackend(params).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) &&
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      }

      {page?.content.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={(page) ? page?.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
