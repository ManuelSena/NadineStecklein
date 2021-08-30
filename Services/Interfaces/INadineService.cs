using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NadineStecklein.Services
{
    public interface INadineService
    {
        List<Nadine> ReadAll();
        //List<Project> ReadById(int id);
        //int Post(ElicitAddRequest model);
        //int Put(ElicitUpdateRequest model);
        //int Delete(int id);
    }
}
