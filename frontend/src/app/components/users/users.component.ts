import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { User } from 'src/app/services/authentication/authentication.service';
import { UserData, UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource: MatTableDataSource<User>; 
  userData: UserData
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role']
  filterValue: string 

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initDataSource()
  }

  initDataSource() {
    this.userService.findAll(1, 10).subscribe(userData => this.setTableData(userData))
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1
    let size = event.pageSize
    this.userService.findAll(page, size, this.filterValue).subscribe(userData => this.setTableData(userData))
  }

  findByName(username: string) {
    this.userService.findAll(1, 10, this.filterValue).subscribe(userData => this.setTableData(userData))
  }

  private setTableData(userData: UserData) {
    this.userData = userData
    this.dataSource = new MatTableDataSource(userData.items)
  }

  navigateToProfile(id: string) {
    this.router.navigate(['./' + id], { relativeTo: this.activatedRoute })
  }

}
